import { Injectable, Logger } from '@nestjs/common';
import { FriendRequest } from './entities/friendRequest.entity';
import { User } from '../../src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class FriendsService {
	constructor(private manager: EntityManager) {
	}

	private readonly logger = new Logger(FriendsService.name);

	async findUserFriends(user: User) {
		try {
			const res = await this.manager.query("SELECT * FROM \"user\" WHERE id IN (SELECT \"userId_2\" as user_friends from user_friends_user where \"userId_1\"=$1);", [user.id]);

			return res;
		} catch (error) {
			this.logger.error("findUserFriends: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async getSentRequests(user: User) {
		try {
			const res = await this.manager.query("select friend_request.*, \"a\".login as receiver_login from friend_request left join \"user\" a on \"friend_request\".\"receiverId\"=\"a\".\"id\" where \"friend_request\".\"senderId\"=$1;", [user.id]);

			return (res);
		} catch (error) {
			this.logger.error("getSentRequests: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async getReceivedRequests(user: User) {
		try {
			const res = await this.manager.query("select friend_request.*, \"a\".login as sender_login from friend_request left join \"user\" a on \"friend_request\".\"senderId\"=\"a\".\"id\" where \"friend_request\".\"receiverId\"=$1;", [user.id]);

			return (res);
		} catch (error) {
			this.logger.error("getReceivedRequests: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async findUserBegining(name: string) {
		try {
			const res = await this.manager.query("SELECT * FROM \"user\" WHERE \"user\".\"login\" LIKE '%$1%' ;", [name]);

			return res;
		} catch (error) {
			this.logger.error("findUserBegining: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async sendFriendRequest(user: User, receiverId: number) {
		try {
			//has a friend request already been sent
			let exists = await this.manager.query("select * from \"friend_request\" WHERE \"senderId\"=$1 AND \"receiverId\"=$2;", [user.id, receiverId]);
			if (Object.keys(exists).length != 1)
			{
				this.logger.error("Someone tried to add a FriendRequest while it already exists ! Sender:#" + user.id + " receiver:#" + receiverId);
				return "";
			}

			//has a friend request already been sent by the other user
			exists = await this.manager.query("select * from \"friend_request\" WHERE \"senderId\"=$1 AND \"receiverId\"=$2;", [receiverId, user.id]);
			if (Object.keys(exists).length != 1)
			{
				this.logger.warn("Someone tried to add a FriendRequest while the other user already sent one ! Sender:#" + user.id + " receiver:#" + receiverId);
				return "";
			}

			//are users already friends
			let already_friends = await this.manager.query("select * from \"user_friends_user\" WHERE \"userId_1\"=$1 AND \"userId_2\"=$2;", [user.id, receiverId]);
			if (Object.keys(exists).length != 1)
			{
				this.logger.warn("User:#" + user.id + " and User:#" + receiverId + " are already friends. not sending the request");
				return "";
			}

			
			const insert = await this.manager.query("INSERT INTO \"friend_request\" (\"senderId\", \"receiverId\") VALUES ($1, $2);", [user.id, receiverId]);
			return insert;
		} catch (error) {
			this.logger.error("sendFriendRequest: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async acceptFriendRequest(user: User, requestId: number) {
		try {
			//does the friend_request exists ?
			let request = await this.manager.query("select * from \"friend_request\" WHERE \"id\"=$1;", [requestId]); 
			if (Object.keys(request).length == 0){
				this.logger.error(`something went wrong ! cannot find the friend request #${requestId}`);
				return ("");
			}

			let already_friends = await this.manager.query("select * from \"user_friends_user\" WHERE \"userId_1\"=$1 AND \"userId_2\"=$2;", [user.id, request[0].senderId]);
			if (Object.keys(already_friends).length != 0)
			{
				this.logger.warn("User:#" + user.id + " and User:#" + request[0].senderId + " are already friends. not sending the request");
				return "";
			}

			this.logger.debug("request[0]:" + request[0]);

			await this.manager.query("INSERT INTO user_friends_user (\"userId_1\", \"userId_2\") VALUES ($1, $2);", [request[0].senderId, request[0].receiverId]);
			await this.manager.query("INSERT INTO user_friends_user (\"userId_1\", \"userId_2\") VALUES ($1, $2);", [request[0].receiverId, request[0].senderId]);

			await this.manager.query("DELETE FROM friend_request WHERE id=$1", [requestId]);
			
			return `request${requestId} Completed (accepted).`;
		} catch (error) {
			this.logger.error("acceptFriendRequest: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async refuseFriendRequest(user: User, requestId: number) {
		//does the friend_request exists ?
		try {
			let request = await this.manager.query("select * from \"friend_request\" WHERE \"id\"=$1;", [requestId]); 
			if (Object.keys(request).length == 0){
				this.logger.error(`something went wrong ! cannot find the friend request #${requestId}`);
				return ("");
			}
			
			await this.manager.query("DELETE FROM friend_request WHERE id=$1", [requestId]);
			return `request${requestId} Completed (refused).`;
		} catch (error) {
			this.logger.error("refuseFriendRequest: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async removeFriend(user: User, userId: number) {
		try {
			await this.manager.query("DELETE FROM \"user_friends_user\" WHERE \"userId_1\"=$1 AND \"userId_2\"=$2;", [user.id, userId]);
			await this.manager.query("DELETE FROM \"user_friends_user\" WHERE \"userId_1\"=$1 AND \"userId_2\"=$2;", [userId, user.id]);
			return `The friendship between User#${user.id} and User#${userId} is now over.`;
		} catch (error) {
			this.logger.error("acceptFriendRequest: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

}

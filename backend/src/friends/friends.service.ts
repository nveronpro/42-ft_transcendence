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
		const res = await this.manager.query("SELECT * FROM \"user\" WHERE id IN (SELECT \"userId_2\" as user_friends from user_friends_user where \"userId_1\"=$1);", [user.id]);

		return res;
	}

	async getSentRequests(user: User) {
		const res = await this.manager.query("select friend_request.*, \"a\".login as receiver_login from friend_request left join \"user\" a on \"friend_request\".\"receiverId\"=\"a\".\"id\" where \"friend_request\".\"senderId\"=$1;", [user.id]);

		return (res);
	}

	async getReceivedRequests(user: User) {
		const res = await this.manager.query("select friend_request.*, \"a\".login as sender_login from friend_request left join \"user\" a on \"friend_request\".\"senderId\"=\"a\".\"id\" where \"friend_request\".\"receiverId\"=$1;", [user.id]);

		return (res);
	}

	async findUserBegining(name: string) {
		const res = await this.manager.query("SELECT * FROM \"user\" WHERE \"user\".\"login\" LIKE '%$1%' ;", [name]);

		return res;
	}

	async sendFriendRequest(user: User, receiverId: number) {
		const exists = await this.manager.query("select * from \"friend_request\" WHERE \"senderId\"=$1 AND \"receiverId\"=$2;", [user.id, receiverId]);
		if (Object.keys(exists).length == 0)
		{
			const insert = await this.manager.query("INSERT INTO \"friend_request\" (\"senderId\", \"receiverId\") VALUES ($1, $2);", [user.id, receiverId]);
			return insert;
		}
		else
		{
			this.logger.error("Someone tried to add a FriendRequest while it already exists ! Sender:#" + user.id + " receiver:#" + receiverId);
			return "";
		}
	}

	async acceptFriendRequest(user: User, requestId: number) {
		const request = await this.manager.query("select * from \"friend_request\" WHERE \"id\"=$1;", [requestId]); 
		if (Object.keys(request).length == 0){
			this.logger.error(`something went wrong ! cannot find the friend request #${requestId}`);
			return ("");
		}

		this.logger.debug("request[0]:" + request[0]);

		await this.manager.query("INSERT INTO user_friends_user (\"userId_1\", \"userId_2\") VALUES ($1, $2);", [request[0].senderId, request[0].receiverId]);
		await this.manager.query("INSERT INTO user_friends_user (\"userId_1\", \"userId_2\") VALUES ($1, $2);", [request[0].receiverId, request[0].senderId]);

		await this.manager.query("DELETE FROM friend_request WHERE id=$1", [requestId]);
		
		return `request${requestId} Completed (accepted).`;
	}

	async refuseFriendRequest(user: User, requestId: number) {
		await this.manager.query("DELETE FROM friend_request WHERE id=$1", [requestId]);
		return `request${requestId} Completed (refused).`;
	}

	async removeFriend(user: User, userId: number) {
		await this.manager.query("DELETE FROM \"user_friends_user\" WHERE \"userId_1\"=$1 AND \"userId_2\"=$2;", [user.id, userId]);
		await this.manager.query("DELETE FROM \"user_friends_user\" WHERE \"userId_1\"=$1 AND \"userId_2\"=$2;", [userId, user.id]);
		return `The friendship between User#${user.id} and User#${userId} is now over.`;
	}

}
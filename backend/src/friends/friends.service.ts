import { Injectable, Logger } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { User } from '../../src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class FriendsService {
	constructor(private manager: EntityManager) {
	}

	private readonly logger = new Logger(FriendsService.name);

	async findUserFriends(user: User) {
		const res = await this.manager.query("SELECT  * FROM \"user\" WHERE id IN (SELECT \"userId_2\" as user_friends from user_friends_user where \"userId_1\"=$1);", [user.id]);

		this.logger.debug("friends:" + res);
		return res;
		return 'This action return all the User\'s friends';
	}

	findUserBegining(name: string) {
		return `This action finds Users with name starting with "name"`;
	}

	addFriend(user: User, id: number) {
		return `This action returns adds	User#${id} as a friend`;
	}

	removeFriend(user: User, id: number) {
		return `This action removes User#${id} as a friend`;
	}

}

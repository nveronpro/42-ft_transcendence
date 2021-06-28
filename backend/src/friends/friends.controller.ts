import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { User as UserType} from '../../src/users/entities/user.entity';
import { get } from 'http';
import { PrimaryGeneratedColumn } from 'typeorm';


@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}
	private readonly logger = new Logger(FriendsController.name);

	@Get()
	@UseGuards(JwtAuthGuard)
	async findUserFriends(@User() user: UserType) {
		this.logger.log("@GET("+")");
		return this.friendsService.findUserFriends(user);
	}

	@Get(':name')
	findUserBegining(@Param('name') name: string) {
	this.logger.log("@GET(name="+name+")");
		return this.friendsService.findUserBegining(name);
	}

	@Post(':id')
	@UseGuards(JwtAuthGuard)
	create(@User() user: UserType, @Param('id') id: number) {
	this.logger.log("@POST(id="+id+")");
		return this.friendsService.addFriend(user, id);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	remove(@User() user: UserType, @Param('id') id: number) {
	this.logger.log("@DELETE(id="+id+")");
		return this.friendsService.removeFriend(user, id);
	}
}

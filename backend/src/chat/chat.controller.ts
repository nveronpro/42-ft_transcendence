import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, UnsupportedMediaTypeException } from '@nestjs/common';
import { User } from '../auth/decorators/user.decorator';
import { User as UserType } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}
	private readonly logger = new Logger(ChatController.name);

	@Get()
	@UseGuards(JwtAuthGuard)
	getAllPublicChats(@User() user: UserType)
	{
		return this.chatService.getAllPublicChats(user);
	}

	@Get("block/")
	@UseGuards(JwtAuthGuard)
	blockedUsers(@User() user: UserType) {
		return (this.chatService.blockedUsers(user));

	}

	@Post("block/:id")
	@UseGuards(JwtAuthGuard)
	blockUser(@User() user: UserType, @Param("id") id: number) {
		this.chatService.block(user, id);

	}

	@Post("unblock/:id")
	@UseGuards(JwtAuthGuard)
	unblockUser(@User() user: UserType, @Param("id") id: number) {
		this.chatService.unblock(user, id);
	}

}

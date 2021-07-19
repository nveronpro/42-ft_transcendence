import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, UnsupportedMediaTypeException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}
	private readonly logger = new Logger(ChatController.name);

	@Get()
	@UseGuards(JwtAuthGuard)
	getAllPublicChats()
	{
		return this.chatService.getAllPublicChats();
	}

}

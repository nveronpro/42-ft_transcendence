import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../auth/decorators/user.decorator';

import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
//import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	async findCurrent(@User() user) {
		const current = await this.usersService.findOne(user.id);

		return (current);
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		const current = await this.usersService.findOne(id);

		return (current);
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Patch()
	@UseGuards(JwtAuthGuard)
	update(@User() user, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(user, updateUserDto);
	}

	@Delete()
	@UseGuards(JwtAuthGuard)
	remove(@User() user) {
		return this.usersService.remove(user);
	}
}

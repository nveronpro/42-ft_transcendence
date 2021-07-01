import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../auth/decorators/user.decorator';

import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { User as UserType} from './entities/user.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	private readonly logger = new Logger(UsersController.name);

	@Get()
	@UseGuards(JwtAuthGuard)
	async findCurrent(@User() user) {
		this.logger.log("@GET("+user+")");
		const current = await this.usersService.findOne(user.id);

		return (current);
	}

	@Get("all")
	async findAll() {
		this.logger.log("@GET(all)");
		const current = await this.usersService.findAll();

		return (current);
	}

	@Get('/avatar')
	@UseGuards(JwtAuthGuard)
	async getUserAvatar(@User() user: UserType) {
		this.logger.log("@GET(avatar)");
		const current = await this.usersService.getUserAvatar(user);

		const res = "<img class=\"avatar\" src=\"data:image/png;base64," + current[0].avatar + "\">";
		
		this.logger.debug("res: " + res);

		return (res);
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		this.logger.log("@GET(id="+id+")");
		const current = await this.usersService.findOne(id);

		return (current);
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Body() createUserDto: CreateUserDto) {
		this.logger.log("@POST()");
		return this.usersService.create(createUserDto);
	}

	@Patch()
	@UseGuards(JwtAuthGuard)
	update(@User() user, @Body() updateUserDto: UpdateUserDto) {
		this.logger.log("@PATCH()");
		return this.usersService.update(user, updateUserDto);
	}

	@Delete()
	@UseGuards(JwtAuthGuard)
	remove(@User() user) {
		this.logger.log("@DELETE()");
		return this.usersService.remove(user);
	}
}

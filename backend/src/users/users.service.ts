import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {EntityRepository, Repository, EntityManager, Connection} from "typeorm";
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(private manager: EntityManager) {
	}
	private readonly logger = new Logger(UsersService.name);

	async create(userData: CreateUserDto) {
		const newUser = await new User();
		newUser.login = userData.login;
		newUser.nickname = userData.nickname;
		newUser.wins = 0;
		newUser.looses = 0;
		newUser.current_status = "none";
		newUser.friends = userData.friends;
		await this.manager.save(newUser);
		return newUser;
	}

	//if no entry is found, then the nickname dosn't exists
	async isNicknameUnique(nick) {
		const res = await this.manager.query("SELECT * FROM \"user\" WHERE \"nickname\" = $1;", [nick]);

		return (Object.keys(res).length == 0);
	}

	async findAll() {
		const res = await this.manager
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.getRawMany();

		//const allUsers = await User.find();
		return res;
	}

	async findOne(id: number) {
		const res = await this.manager
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.id = :id", {id: id})
		.getRawMany();

		return res;
	}

	async getUserAvatar(user: User) {
		const res = await this.manager.query("SELECT avatar FROM \"user\" WHERE \"id\" = $1;", [user.id]);
		this.logger.debug("user#" + user.id + "'s avatar:" + res[0].avatar);

		return (res);
	}

	async findOneWhithLogin(login: string) {
		const user = await this.manager.findOne(User, { login: login });
		return user;
	}


	/*
    login: string;

    nickname: string;

    wins: number;

    looses: number;

    friends: User[];

    current_status: string;
	*/
	async update(user: User, updateUserDto: UpdateUserDto) {
		const res = await this.manager
		.createQueryBuilder()
		.update("user")
		.set(updateUserDto)
		.where("user.id = :id", {id: user.id})
		.execute();
	}

	async remove(user: User) {
		const res = await this.manager
		.createQueryBuilder()
		.delete()
		.from(User)
		.where("user.id = :id", {id: user.id})
		.execute();
	}
}

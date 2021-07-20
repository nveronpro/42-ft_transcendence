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
		try {
			const newUser = await new User();
			newUser.login = userData.login;
			newUser.nickname = userData.nickname;
			newUser.wins = 0;
			newUser.looses = 0;
			newUser.current_status = "none";
			newUser.friends = userData.friends;
			await this.manager.save(newUser);
			return newUser;
		} catch (error) {
			this.logger.error("create: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	//if no entry is found, then the nickname dosn't exists
	async isNicknameUnique(nick) {
		try {
			const res = await this.manager.query("SELECT * FROM \"user\" WHERE \"nickname\" = $1;", [nick]);

			return (Object.keys(res).length == 0);
		} catch (error) {
			this.logger.error("isNicknameUnique: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async findAll() {
		try {
			const res = await this.manager
			.createQueryBuilder()
			.select("user")
			.from(User, "user")
			.getRawMany();

			//const allUsers = await User.find();
			return res;
		} catch (error) {
			this.logger.error("findAll: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async findOne(id: number) {
		try {
			const res = await this.manager
			.createQueryBuilder()
			.select("user")
			.from(User, "user")
			.where("user.id = :id", {id: id})
			.getRawMany();

			return res;
		} catch (error) {
			this.logger.error("findOne: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async getUserAvatar(userId: number) {
		try {
			const res = await this.manager.query("SELECT avatar FROM \"user\" WHERE \"id\" = $1;", [userId]);

			return (res);
		} catch (error) {
			this.logger.error("getUserAvatar: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async findOneWhithLogin(login: string) {
		try {
			const user = await this.manager.findOne(User, { login: login });
			return user;
		} catch (error) {
			this.logger.error("findOneWhithLogin: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async updateStatus(user: User, status: string) {
		try {
			const res = await this.manager.query("UPDATE \"user\" SET current_status=$1 WHERE \"id\" = $2;", [status, user.id]);
			return ;
		} catch (error) {
			this.logger.error("updateStatus: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
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
		//console.log(updateUserDto)
		try {
			const res = await this.manager
			.createQueryBuilder()
			.update("user")
			.set(updateUserDto)
			.where("user.id = :id", {id: user.id})
			.execute();
		} catch (error) {
			this.logger.error("update: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async remove(user: User) {
		try {
			const res = await this.manager
			.createQueryBuilder()
			.delete()
			.from(User)
			.where("user.id = :id", {id: user.id})
			.execute();
		} catch (error) {
			this.logger.error("remove: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}
}

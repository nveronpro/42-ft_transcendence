import { Injectable, Logger } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User as UserType} from '../../src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProfileService {
	constructor(private manager: EntityManager) {
	}

	private readonly logger = new Logger(ProfileService.name);

	async updateAvatar(user: UserType, file/*: Express.Multer.File*/) {
		try {
			const res = await this.manager.query("UPDATE \"user\" SET \"avatar\" = $1 WHERE \"id\"=$2;", [file.buffer.toString('base64'), user.id]);
			return (res);
		} catch (error) {
			this.logger.error("updateAvatar: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async updateNickname(user: UserType, nick: string) {
		try {
			const exists = await this.manager.query("SELECT * FROM \"user\" WHERE \"nickname\" = $1;", [nick]);

			if (Object.keys(exists).length != 0)
			{
				this.logger.error(`the User#${user.id} attemps to change it's nickname to an already existing nickname: ${nick} !`);
				return ("");
			}

			const res = await this.manager.query("UPDATE \"user\" SET \"nickname\" = $1 WHERE \"id\" = $2;", [nick, user.id]);

			return (res);
		} catch (error) {
			this.logger.error("updateNickname: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}
}

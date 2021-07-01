import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User as UserType} from '../../src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProfileService {
	constructor(private manager: EntityManager) {
	}

  async updateAvatar(user: UserType, file/*: Express.Multer.File*/) {
    const res = await this.manager.query("UPDATE \"user\" SET \"avatar\" = $1 WHERE \"id\"=$2;", [file.buffer.toString('base64'), user.id]);
    return (res);
  }

  updateNickname(user: UserType, nick: string) {
    return 'This action updates the Users nickname';
  }
}

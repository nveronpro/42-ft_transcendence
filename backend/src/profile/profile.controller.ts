import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { User as UserType} from '../../src/users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}
	private readonly logger = new Logger(ProfileController.name);

	@Patch("avatar")
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	async updateAvatar(@User() user: UserType, @UploadedFile() file/*: Express.Multer.File*/) {
		this.logger.log("@PATCH(avatar)");
		//this.logger.debug("file: " + file.buffer.toString('base64'));
		const ret = this.profileService.updateAvatar(user, file);
		this.logger.log("@PATCH(avatar): Avatar updated");
		return ret;
	}

	@Post("nickname/:nick")
	@UseGuards(JwtAuthGuard)
	async updateNickname(@User() user: UserType, @Param("nick") nick: string) {
		this.logger.log("@PATCH(nickname/" + nick + ")");
		return this.profileService.updateNickname(user, nick);
	}

	@Post("2fa/:bool")
	@UseGuards(JwtAuthGuard)
	async update2fa(@User() user: UserType, @Param("bool") bool: boolean) {
		this.logger.log("@POST(2fa/" + bool + ")");
		return this.profileService.update2fa(user, bool);
	}
}

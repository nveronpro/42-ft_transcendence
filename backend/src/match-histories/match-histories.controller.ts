import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, UnsupportedMediaTypeException } from '@nestjs/common';
import { MatchHistoriesService } from './match-histories.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { User as UserType} from '../../src/users/entities/user.entity';

@Controller('match-histories')
export class MatchHistoriesController {
	constructor(private readonly matchHistoriesService: MatchHistoriesService) {}
	private readonly logger = new Logger(MatchHistoriesController.name);

	@Get()
	@UseGuards(JwtAuthGuard)
	async findUserHistory(@User() user: UserType) {
		this.logger.log("@GET()");
		return this.matchHistoriesService.findUserHistory(user);
	}

	@Get("/friend/:id")
	async findFriendHistory(@Param('id') id: number) {
		this.logger.log("@GET()");
		return this.matchHistoriesService.findFriendHistory(id);
	}

	@Get("/all")
	findAll() {
		this.logger.log("@GET(\"/all\")");
		return this.matchHistoriesService.findAll();
	}
	
	@Get(':id')
	findOne(@Param('id') id: number) {
		this.logger.log("@GET(id="+id+")");
		return this.matchHistoriesService.findOne(id);
	}



	@Post()
	@UseGuards(JwtAuthGuard)
	create(@User() user: UserType, @Body() createMatchHistoryDto: CreateMatchHistoryDto) {
		this.logger.log("@POST()");
		this.matchHistoriesService.create(createMatchHistoryDto);
		return ;
	}

	
	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	update(@Param('id') id: string, @Body() updateMatchHistoryDto: UpdateMatchHistoryDto) {
		this.logger.log("@PATCH(id="+id+")");
		this.logger.warn("This operation is not supposed to be done. It has been blocked");
		//return this.matchHistoriesService.update(+id, updateMatchHistoryDto);
		return ;
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	remove(@Param('id') id: string) {
		this.logger.log("@DELETE(id="+id+")");
		this.logger.warn("This operation is not supposed to be done. It has been blocked");
		// return this.matchHistoriesService.remove(+id);
		return ;
	}
}

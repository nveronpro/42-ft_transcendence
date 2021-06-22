import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from '@nestjs/common';
import { MatchHistoriesService } from './match-histories.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';

@Controller('match-histories')
export class MatchHistoriesController {
	constructor(private readonly matchHistoriesService: MatchHistoriesService) {}
	private readonly logger = new Logger(MatchHistoriesController.name);

	@Post()
	create(@Body() createMatchHistoryDto: CreateMatchHistoryDto) {
		this.logger.log("@POST()");
		return this.matchHistoriesService.create(createMatchHistoryDto);
	}

	// @Get()
	// findAll() {
	// 	return this.matchHistoriesService.findAll();
	// }
	
	@Get()
	@UseGuards(JwtAuthGuard)
	async findUserHistory(@User() user) {
		this.logger.log("@GET("+user+")");
		return this.matchHistoriesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		this.logger.log("@GET("+id+")");
		return this.matchHistoriesService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateMatchHistoryDto: UpdateMatchHistoryDto) {
		this.logger.log("@PATCH("+id+")");
		return this.matchHistoriesService.update(+id, updateMatchHistoryDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		this.logger.log("@DELETE("+id+")");
		return this.matchHistoriesService.remove(+id);
	}
}

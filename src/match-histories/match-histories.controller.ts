import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchHistoriesService } from './match-histories.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
//import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';

@Controller('match-histories')
export class MatchHistoriesController {
  constructor(private readonly matchHistoriesService: MatchHistoriesService) {}

  @Post()
  create(@Body() createMatchHistoryDto: CreateMatchHistoryDto) {
    return this.matchHistoriesService.create(createMatchHistoryDto);
  }

  @Get()
  findAll() {
    return this.matchHistoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchHistoriesService.findOne(+id);
  }

  //@Patch(':id')
  //update(@Param('id') id: string, @Body() updateMatchHistoryDto: UpdateMatchHistoryDto) {
  //  return this.matchHistoriesService.update(+id, updateMatchHistoryDto);
  //}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchHistoriesService.remove(+id);
  }
}

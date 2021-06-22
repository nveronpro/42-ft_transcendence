import { Module } from '@nestjs/common';
import { MatchHistoriesService } from './match-histories.service';
import { MatchHistoriesController } from './match-histories.controller';

@Module({
  controllers: [MatchHistoriesController],
  providers: [MatchHistoriesService]
})
export class MatchHistoriesModule {}

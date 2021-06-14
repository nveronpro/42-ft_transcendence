import { Test, TestingModule } from '@nestjs/testing';
import { MatchHistoriesController } from './match-histories.controller';
import { MatchHistoriesService } from './match-histories.service';

describe('MatchHistoriesController', () => {
  let controller: MatchHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchHistoriesController],
      providers: [MatchHistoriesService],
    }).compile();

    controller = module.get<MatchHistoriesController>(MatchHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

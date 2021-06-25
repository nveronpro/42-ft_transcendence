import { Injectable, Logger } from '@nestjs/common';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';
// import { User } from 'src/users/entities/user.entity';
import { User } from '../users/entities/user.entity';
import { MatchHistory } from '../match-histories/entities/match-history.entity';
import { Connection, EntityManager } from 'typeorm';


@Injectable()
export class MatchHistoriesService {
	constructor(private manager: EntityManager) {
	}

	private readonly logger = new Logger(MatchHistoriesService.name);

	async create(createMatchHistoryDto: CreateMatchHistoryDto) {
		const res = await this.manager
		.createQueryBuilder()
		.insert()
		.into(MatchHistory)
		.values(createMatchHistoryDto)
		.execute();

		this.logger.verbose("result:" + res);

		// return (res);
	}

	async findAll() {
		this.logger.verbose(`returning all matches in history !`);

		const res = await this.manager
		.createQueryBuilder()
		.select("match_histories")
		.from(MatchHistory, "match_histories")
		.getRawMany();

		this.logger.verbose("result:" + res);

		return (res);
	}

	async findUserHistory(user: User) {

		this.logger.verbose(`This action returns User #${user.id}'s match history`);

		const res = await this.manager
		.createQueryBuilder()
		.select("match_history")
		.from(MatchHistory, "match_history")
		.where("match_history.winnerId = :winner", {winner: user.id})
		.orWhere("match_history.looserId = :looser", {looser: user.id})
		.getRawMany();

		this.logger.verbose("result:" + res);

		return (res);

	}

	async findOne(id: number) {

		const res = await this.manager
		.createQueryBuilder()
		.select("match_history")
		.from(MatchHistory, "match_history")
		.where("match_history.id = :id", {id: id})
		.getRawOne();

		this.logger.verbose("result:" + res);

		return (res);
	}

	update(id: number, updateMatchHistoryDto: UpdateMatchHistoryDto) {
		return `This action updates a #${id} matchHistory`;
	}

	remove(id: number) {
		return `This action removes a #${id} matchHistory`;
	}
}

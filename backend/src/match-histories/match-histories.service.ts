import { Injectable, Logger } from '@nestjs/common';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';
// import { User } from 'src/users/entities/user.entity';
import { User } from '../users/entities/user.entity';
import { MatchHistory } from '../match-histories/entities/match-history.entity';
import { Connection, EntityManager } from 'typeorm';


@Injectable()
export class MatchHistoriesService {
	constructor(private manager: EntityManager, private connection: Connection) {
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

		const res = await this.manager.query("SELECT match_history.*, a.login as winner_login, a.nickname as winner_nickname, b.login as looser_login, b.nickname as looser_nickname from match_history LEFT JOIN \"user\" A ON \"match_history\".\"winnerId\"=A.\"id\" LEFT JOIN \"user\" B ON \"match_history\".\"looserId\"=B.\"id\" WHERE A.id=$1 OR B.id=$1;", [user.id]);

		this.logger.verbose("result:" + res);

		return (res);

	}

	async findFriendHistory(id: number) {

		this.logger.verbose(`This action returns User #${id}'s match history`);

		const res = await this.manager.query("SELECT match_history.*, a.login as winner_login, a.nickname as winner_nickname, b.login as looser_login, b.nickname as looser_nickname from match_history LEFT JOIN \"user\" A ON \"match_history\".\"winnerId\"=A.\"id\" LEFT JOIN \"user\" B ON \"match_history\".\"looserId\"=B.\"id\" WHERE A.id=$1 OR B.id=$1;", [id]);

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

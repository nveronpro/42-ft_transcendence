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
		try {
			const res = await this.manager
			.createQueryBuilder()
			.insert()
			.into(MatchHistory)
			.values(createMatchHistoryDto)
			.execute();


			const updateWinner = await this.manager.query("UPDATE \"user\" SET \"wins\" = \"wins\" + 1 WHERE \"id\" = $1;", [createMatchHistoryDto.winner.id]);
			const updateLooser = await this.manager.query("UPDATE \"user\" SET \"looses\" = \"looses\" + 1 WHERE \"id\" = $1;", [createMatchHistoryDto.looser.id]);

			this.logger.verbose("result:" + res);

			// return (res);
		} catch (error) {
			this.logger.error("create: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async findAll() {
		try {
			this.logger.verbose(`returning all matches in history !`);

			const res = await this.manager
			.createQueryBuilder()
			.select("match_histories")
			.from(MatchHistory, "match_histories")
			.getRawMany();

			this.logger.verbose("result:" + res);

			return (res);
		} catch (error) {
			this.logger.error("findAll: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
	}

	async findUserHistory(user: User) {
		try {

			this.logger.verbose(`This action returns User #${user.id}'s match history`);

			const res = await this.manager.query("SELECT match_history.*, a.login as winner_login, a.nickname as winner_nickname, a.avatar as winner_avatar, b.login as looser_login, b.nickname as looser_nickname, b.avatar as looser_avatar from match_history LEFT JOIN \"user\" A ON \"match_history\".\"winnerId\"=A.\"id\" LEFT JOIN \"user\" B ON \"match_history\".\"looserId\"=B.\"id\" WHERE A.id=$1 OR B.id=$1;", [user.id]);

			this.logger.verbose("result:" + res);

			return (res);
		} catch (error) {
			this.logger.error("findUserHistory: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}

	}

	async findFriendHistory(id: number) {
		try {

			this.logger.verbose(`This action returns User #${id}'s match history`);

			const res = await this.manager.query("SELECT match_history.*, a.nickname as winner_nickname, a.nickname as winner_nickname, a.avatar as winner_avatar, b.nickname as looser_nickname, b.nickname as looser_nickname, b.avatar as looser_avatar from match_history LEFT JOIN \"user\" A ON \"match_history\".\"winnerId\"=A.\"id\" LEFT JOIN \"user\" B ON \"match_history\".\"looserId\"=B.\"id\" WHERE A.id=$1 OR B.id=$1;", [id]);

			this.logger.verbose("result:" + res);

			return (res);
		} catch (error) {
			this.logger.error("findFriendHistory: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}

	}

	async findOne(id: number) {
		try {

			const res = await this.manager
			.createQueryBuilder()
			.select("match_history")
			.from(MatchHistory, "match_history")
			.where("match_history.id = :id", {id: id})
			.getRawOne();

			this.logger.verbose("result:" + res);

			return (res);
		} catch (error) {
			this.logger.error("findFriendHistory: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
		
	}

	update(id: number, updateMatchHistoryDto: UpdateMatchHistoryDto) {
		return `This action updates a #${id} matchHistory`;
	}

	remove(id: number) {
		return `This action removes a #${id} matchHistory`;
	}
}

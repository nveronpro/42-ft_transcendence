import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity, ConnectionNotFoundError } from 'typeorm';
import { MatchHistory } from '../../match-histories/entities/match-history.entity';

@Entity()
export class User extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	login: string;

	@Column()
	nickname: string;

	@Column()
	wins: number;

	@Column()
	looses: number;

	@Column()
	current_status: string;

	@ManyToMany(() => User)
	@JoinTable()
	friends: User[];

	@ManyToMany(() => MatchHistory)
	@JoinTable()
	match_histories: MatchHistory[];

	@Column(/*"bytea", */{nullable: true})
	avatar: string;

}

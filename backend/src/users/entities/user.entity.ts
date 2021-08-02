import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity, ConnectionNotFoundError } from 'typeorm';
import { MatchHistory } from '../../match-histories/entities/match-history.entity';

@Entity()
export class User extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	//being the 42 logins, this constraint should IN THEORY always be fullfilled
	@Column({unique: true})
	login: string;

	@Column({unique: true})
	nickname: string;

	@Column()
	wins: number;

	@Column()
	looses: number;

	@Column()
	current_status: string;

	@Column({ default: false })
	two_factor_auth: boolean;

	@Column({nullable: true})
	secret: string;

	@Column({nullable: true})
	qrcode_data: string;

	@ManyToMany(() => User)
	@JoinTable()
	friends: User[];

	@ManyToMany(() => MatchHistory)
	@JoinTable()
	match_histories: MatchHistory[];

	@Column({nullable: true})
	avatar: string;

	@Column({nullable: true})
	socketId: string;
}

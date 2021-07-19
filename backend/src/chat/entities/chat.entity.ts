import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity, ConnectionNotFoundError, ManyToOne } from 'typeorm';

@Entity()
export class Chat extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({nullable: true})
	password: string;

	@Column()
	private: boolean;
}

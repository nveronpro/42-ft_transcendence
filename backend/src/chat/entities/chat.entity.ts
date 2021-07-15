import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity, ConnectionNotFoundError, ManyToOne, OneToMany } from 'typeorm';
import { ChatUser } from './chatUser.entity';

@Entity()
export class Chat extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	password: string;

	//@OneToMany(type => ChatUser, ChatUser => ChatUser.user)
	//chatUsers: ChatUser;
}

import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity, ConnectionNotFoundError, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class ChatUsers extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => Chat)
	chatId: Chat;

	@ManyToOne(type => User)
	user: User;

	@Column()
	userStatus: number;
}

import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity, ConnectionNotFoundError, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';
import { userRoles } from './chatUsersRoles';



@Entity()
export class ChatUser extends BaseEntity {

	//@ManyToOne(type => Chat, chat => chat.chatUsers, { primary: true })
	@ManyToOne(type => Chat, {primary: true})
	chat: Chat;

	@ManyToOne(type => User, {primary: true})
	user: User;

	@Column({
		type: "enum",
		enum: userRoles,
		default: userRoles.USER
	})
	userStatus: userRoles;
}

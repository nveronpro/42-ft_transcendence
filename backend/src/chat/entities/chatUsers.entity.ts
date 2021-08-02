import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity, ConnectionNotFoundError, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';
import { UserRole } from './userStatus.enum';



@Entity()
export class ChatUsers extends BaseEntity {

	@ManyToOne(type => Chat, {primary: true})
	chat: Chat;

	@ManyToOne(type => User, {primary: true})
	user: User;

	@Column({type:"enum", enum: UserRole, default: UserRole.USER})
	userRole: UserRole;
}

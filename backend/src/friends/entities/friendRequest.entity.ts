import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class FriendRequest extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => User)
	sender: User;

	@ManyToOne(type => User)
	receiver: User;
}
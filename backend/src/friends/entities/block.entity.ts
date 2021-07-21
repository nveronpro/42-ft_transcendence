import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Block extends BaseEntity {

	@ManyToOne(type => User, {primary: true})
	blocker: User;

	@ManyToOne(type => User, {primary: true})
	blocked: User;
}
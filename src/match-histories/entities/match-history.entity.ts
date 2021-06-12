import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class MatchHistory extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: string;

  @ManyToOne(type => User)
  winner: User;

  @ManyToOne(type => User)
  looser: User;
}
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class MatchHistory {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: string;

  @ManyToOne(type => User)
  winner: User;

  @ManyToOne(type => User)
  looser: User;
}
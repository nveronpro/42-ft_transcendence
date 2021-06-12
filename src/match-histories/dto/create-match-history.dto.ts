import { User } from '../../users/entities/user.entity';

export class CreateMatchHistoryDto {
    score: string;
  
    winner: User;
  
    looser: User;
}

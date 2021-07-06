import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { User } from '../entities/user.entity'
import { MatchHistory } from "../../match-histories/entities/match-history.entity"

export class CreateUserDto {
    login: string;

    nickname: string;

    wins: number;

    looses: number;

    friends: User[];

    current_status: string;

    secret: string;

    qrcode_data: string;

    match_histories: MatchHistory[];

    avatar: string;
}

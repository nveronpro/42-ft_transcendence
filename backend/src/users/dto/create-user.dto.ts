import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { User } from '../entities/user.entity'

export class CreateUserDto {
    login: string;

    nickname: string;

    wins: number;

    looses: number;

    friends: User[];

    current_status: string;
}

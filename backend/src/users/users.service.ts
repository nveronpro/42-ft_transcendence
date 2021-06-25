import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {EntityRepository, Repository, EntityManager} from "typeorm";
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private manager: EntityManager) {
  }

  async create(userData: CreateUserDto) {
    const newUser = await new User();
    newUser.login = userData.login;
    newUser.nickname = userData.nickname;
    newUser.wins = 0;
    newUser.looses = 0;
    newUser.current_status = "none";
    newUser.friends = userData.friends;
    await this.manager.save(newUser);
    return newUser;
  }

  async findAll() {
    const allUsers = await User.find();
    console.log(allUsers);
    return allUsers;
  }
  
  async findOneWhithLogin(login: string) {
    const user = await this.manager.findOne(User, { login: login });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { Connection, EntityManager } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {genSalt, hash} from 'bcryptjs';

@Injectable()
export class ChatService {
  constructor(private manager: EntityManager, private connection: Connection) { }
  private readonly logger = new Logger(ChatService.name);

  async connectUser(user: User, sock: Socket) {
    const updateWinner = await this.manager.query("UPDATE \"user\" SET \"socketId\" = $1 WHERE \"id\" = $2;", [sock.id, user.id]);
    return ;
  }

  async disconnectUser(user: User) {
    const updateWinner = await this.manager.query("UPDATE \"user\" SET \"socketId\" = $1 WHERE \"id\" = $2;", [null, user.id]);
    //TODO Disconnect from channels
  }

  async createRoom(user: User, roomName: string, password: string | undefined) {
    const saltOrRound = 42;
    if (password !== undefined) {
      const salt = await genSalt(saltOrRound);
      const hashPass = await hash(password, salt);
      const room = await this.manager.query("INSERT INTO \"chat\" (\"name\", \"password\") VALUES ($1, $2);", [roomName, hashPass]);
    }
    else {
      const room = await this.manager.query("INSERT INTO \"chat\" (\"name\", \"password\") VALUES ($1, $2);", [roomName, null]);
    }

    //join created room
  }

  async joinRoom(user: User, roomId: number, password: string | undefined) {
    const room = await this.manager.query("SELECT * FROM \"chat\" WHERE \"id\" = $1;", [roomId]);

    if (room[0] == undefined) { // the room does not exist. wout ?

    }
  }

  leaveRoom(user: User) {

  }

  sendServerPrivateMessage(user: User) {

  }

  sendServerMessage(user: User) {

  }

  sendServerCommand(user: User) {

  }

}
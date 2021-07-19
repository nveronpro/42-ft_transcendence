import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { User as UserType } from '../../src/users/entities/user.entity';
import { Connection, EntityManager } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {genSalt, hash, compare} from 'bcrypt';
import { Chat } from './entities/chat.entity';
import { UserRole } from './entities/userStatus.enum';
import { User } from 'src/auth/decorators/user.decorator';
import { ChatUsers } from './entities/chatUsers.entity';
import { CreateChatUserDto } from './dto/create-chatUsers.dto';



@Injectable()
export class ChatService {
  constructor(private manager: EntityManager, private connection: Connection) { }
  private readonly logger = new Logger(ChatService.name);

  // +---------------------------------------------------------+
  // |                      CONTROLLER                         |
  // +---------------------------------------------------------+

  async getAllPublicChats(){
    const res = await this.manager.query("SELECT \"id\", \"name\" FROM \"chat\" WHERE \"private\"=false;");

    return (res);
  }






  // +---------------------------------------------------------+
  // |                       GATEWAY                           |
  // +---------------------------------------------------------+

  async getUserLogin(login: string): Promise<UserType> {
    try {
      const user: UserType = await UserType.findOne({login: login});
      return user;
    }
    catch (error) {
			this.logger.error("getUserLogin: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
		}
  }

  async connectUser(user: UserType, sock: Socket) {
    const updateWinner = await this.manager.query("UPDATE \"user\" SET \"socketId\" = $1 WHERE \"id\" = $2;", [sock.id, user.id]);
    return ;
  }

  async disconnectUser(user: UserType) {
    const updateWinner = await this.manager.query("UPDATE \"user\" SET \"socketId\" = $1 WHERE \"id\" = $2;", [null, user.id]);
    //TODO Disconnect from channels
  }

  async createPublicRoom(
    server: Server,
    client: Socket,
    user: UserType,
    roomName: string,
    password?: string | undefined
  ) {
    try {
      if (roomName.length < 3){
        //TODO emit error 
        return ;
      }

      const toCreate: CreateChatDto = new CreateChatDto();
      let room: Chat;

      toCreate.name = roomName;
      toCreate.private = false;


      if (password !== undefined && password !== "") {
        const saltOrRound = 42;
        const salt = await genSalt(saltOrRound);
        toCreate.password = await hash(password, salt);


        room = await Chat.create(toCreate).save();
      }
      else {
        toCreate.password = null;
        room = await Chat.create(toCreate).save();
      }
      
      const newUser: CreateChatUserDto = new CreateChatUserDto();
      newUser.chat = room;
      newUser.user = user;
      newUser.userRole = UserRole.OWNER;
      await ChatUsers.create(newUser).save();
      
      client.join(String(room.id));
      client.emit("open", {id: room.id, name: roomName});
      server.to(String(room.id)).emit("message", {login: "Server", destination: room.id, text:`User ${user.nickname} has joined the chat.`});
    }
    catch (error) {
			this.logger.error("createPublicRoom: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
  }

  async createPrivateRoom(
    server: Server,
    client: Socket,
    user: UserType,
    targetLogin: string
  ) {
    try {
      let room: Chat;

      const target: UserType = await UserType.findOne({login: targetLogin});
      // if (target.current_status == "offline")
      // {
      //   this.logger.debug("User is offline");
      //   // TODO emit error target not connected
      //   return ;
      // }
      // TODO Check if user is blocked.

      const roomToCreate: CreateChatDto = new CreateChatDto();
      roomToCreate.name = "Private Messages " + user.nickname + "\\" + target.nickname;
      roomToCreate.password = null;
      roomToCreate.private = true;

      room = await Chat.create(roomToCreate).save();
      // room = await this.manager.query("INSERT INTO \"chat\" (\"name\", \"password\", \"private\") VALUES ($1, $2);", ["Private Messages " + user.nickname + "\\" + target.nickname, null, true]);

      const privateChatUser: CreateChatUserDto = new CreateChatUserDto();

      privateChatUser.chat = room;
      privateChatUser.user = user;

      privateChatUser.userRole = UserRole.USER
      ChatUsers.create(privateChatUser).save();

      privateChatUser.user = target;
      ChatUsers.create(privateChatUser).save();

      // TODO PUT THIS BACK server.sockets.sockets[target.socketId].join(String(room.id));
      client.join(String(room.id));

      server.to(String(room.id)).emit("open", {id: room.id, name: room.name});
      server.to(String(room.id)).emit("message", {login: "Server", destination: room.id, text: `User ${user.nickname} wishes to chat with ${target.nickname}.`});
    }
    catch (error) {
			this.logger.error("createPrivateRoom: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
  }

  async joinRoom(
    server: Server,
    client: Socket,
    user: UserType,
    roomId: number,
    password?: string | undefined
  ) {
    try {
      const room: Chat = await Chat.findOne({id: roomId});

      if (room == undefined) { // the room does not exist. wout ?
        this.logger.error(`joinRoom: User#${user.id} tried to join room#${roomId} but it doesn't exist !`);
        // TODO emit error
        return ;
      }
      else if (room.private === true) {
        this.logger.error(`joinRoom: User#${user.id} tried to join room#${roomId} but it is a private room !`);
        // TODO emit error
        return ;
      }
      // TODO check if used in banned from room
      else {
        if (room.password != undefined && await compare(password, room.password) == false ) {
          // TODO emit error password mismatch
          return ;
        }
        await this.manager.query("INSERT INTO \"chat_user\" (\"userId\", \"chatId\") VALUES ($1, $2) ;", [user.id, roomId]);
        client.join(String(room.id));
        server.to(String(room.id)).emit(`User ${user.nickname} has joined the chat`);
        return {id: room.id, name: room.name}
      }
    } catch (error) {
			this.logger.error("joinRoom: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
  }

  async msgToServer(
    server: Server,
    client: Socket,
    user: UserType,
    roomId: number,
    message: string
  ) {
    try {

      // TODO check the user has the right to send the message (on channel, not muted).

      server.to(String(roomId)).emit("message", {login: user.login, destination: roomId, text: message});

    }
    catch (error) {
			this.logger.error("msgToServer: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
  }












  async leaveRoom(
    server: Server,
    client: Socket,
    user: UserType,
    roomId: number
  ) {
    try {
      const room: Chat[] = await this.manager.query("SELECT * FROM \"chat\" WHERE \"id\" = $1;", [roomId]);

      if (room[0] == undefined) { // the room does not exist. wout ?
        this.logger.error(`leaveRoom: User#${user.id} tried to leave room#${roomId} but it doesn't exists`);
        return ;
      }
      else {
        // TODO send users un channel leave event
        await this.manager.query("DELETE FROM \"chat_user\" WHERE userId=$1 AND chatId=$2;", [user.id, roomId]);
        client.leave(String(room[0].id));
      }
    } catch (error) {
			this.logger.error("joinRoom: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
  }

  sendServerPrivateMessage(
    server: Server,
    client: Socket,
    user: UserType
  ) {

  }

  sendServerMessage(
    server: Server,
    client: Socket,
    user: UserType
  ) {

  }

  sendServerCommand(
    server: Server,
    client: Socket,
    user: UserType,
  ) {

  }

}
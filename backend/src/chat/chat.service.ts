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

  async disconnectUser(server: Server, user: UserType) {
    //Sending to all channels the left message
    const userChats: ChatUsers[] = await this.manager.query("SELECT * FROM \"chatUsers\" WHERE \"userId\" = $1 AND \"userRole <> $2", [user.id, UserRole.BANNED]);
    
    for (let chat in userChats) {
      server.to(String(userChats[chat].chat)).emit(`User ${user.nickname} has left the chat`);
    }

    const chatToRemove = await this.manager.query("SELECT \"chatId\" FROM (SELECT \"chatId\", COUNT(\"chatId\") AS number_of_users FROM \"chat_users\" WHERE \"chatId\" IN (SELECT \"chatId\" FROM \"chat_users\" WHERE \"userId\" = $1) GROUP BY \"chatId\") AS A WHERE A.number_of_users = 1;");

    
    
    const arrayChatToRemove = chatToRemove.map(a => a.chatId);
    
    await this.manager.query("DELETE FROM \"chat\" WHERE \"id\" IN $1;", [arrayChatToRemove]);
    await this.manager.query("DELETE FROM \"chat_users\" WHERE \"userId\"=$1;", [user.id]);


    const disconnectUser = await this.manager.query("UPDATE \"user\" SET \"socketId\" = $1 WHERE \"id\" = $2;", [null, user.id]);
    
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
        client.emit("error", {text: "The room name is too short. it must be at least 3 characters"});
        return ;
      }

      const toCreate: CreateChatDto = new CreateChatDto();
      let room: Chat;

      toCreate.name = roomName;
      toCreate.private = false;


      if (password !== undefined && password !== "") {
        const saltOrRound = 12;
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
      if (target.current_status == "offline")
      {
        this.logger.debug("User is offline");
        client.emit("error", {text: `the User ${target.nickname} is offline. unable to send message`});
        return ;
      }

      // TODO Check if user is blocked.

      //creating room
      const roomToCreate: CreateChatDto = new CreateChatDto();
      roomToCreate.name = "Private Messages " + user.nickname + "\\" + target.nickname;
      roomToCreate.password = null;
      roomToCreate.private = true;

      room = await Chat.create(roomToCreate).save();

      //adding users to chatRoom in DB

      const privateChatUser: CreateChatUserDto = new CreateChatUserDto();

      privateChatUser.chat = room;
      privateChatUser.user = user;

      privateChatUser.userRole = UserRole.USER
      ChatUsers.create(privateChatUser).save();

      privateChatUser.user = target;
      ChatUsers.create(privateChatUser).save();

      //adding users to chatRoom in socket

      server.sockets.sockets[target.socketId].join(String(room.id));
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
        client.emit("error", {text: "You cann not join this room !"});
        return ;
      }

      if (room.private === true) {
        this.logger.error(`joinRoom: User#${user.id} tried to join room#${roomId} but it is a private room !`);
        client.emit("error", {text: "You cann not join this room for it is private !"});
        return ;
      }
      const isUserInChannelOrBanned: ChatUsers = (await this.manager.query("SELECT * FROM \"chat_users\" WHERE \"chatId\" = $1 AND \"userId\" = $2;", [roomId, user.id]))[0];

      if (isUserInChannelOrBanned !== undefined)
      {
        this.logger.warn(`joinRoom: User#${user.id} tried to join room#${roomId} but can't. he is either banned or already in it`);
        client.emit("error", {text: "You cann not join this room becaus eeither you're already in it or banned !"});
        return ;
      }

      //join room !
      if (room.password != undefined && await compare(password, room.password) == false ) {
        client.emit("error", {text: "You cann not join this room: Wrong Password !"});
        return ;
      }
      await this.manager.query("INSERT INTO \"chat_user\" (\"userId\", \"chatId\") VALUES ($1, $2) ;", [user.id, roomId]);
      client.join(String(room.id));
      server.to(String(room.id)).emit(`User ${user.nickname} has joined the chat`);
      return {id: room.id, name: room.name};

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

      const userInChannel: ChatUsers = (await this.manager.query("SELECT * FROM \"chat_users\" WHERE \"chatId\" = $1 AND \"userId\" = $2;", [roomId, user.id]))[0];
      if (userInChannel === undefined ||
        userInChannel.userRole == UserRole.MUTED ||
        userInChannel.userRole == UserRole.BANNED) {
          client.emit("error", {text: `You cannot send message to this channel`});
          return ;
        }
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
      const room: Chat = await Chat.findOne({id: roomId});

      if (room[0] == undefined) { // the room does not exist. wout ?
        this.logger.error(`leaveRoom: User#${user.id} tried to leave room#${roomId} but it doesn't exists`);
        return ;
      }
      else {
        await this.manager.query("DELETE FROM \"chat_users\" WHERE userId=$1 AND chatId=$2;", [user.id, roomId]);
        server.to(String(roomId)).emit("message", {login: "Server", destination:room.name, text:`User ${user.nickname} has joined the chat`});
        client.emit("close", {destination: room.name, text: "You have left the room"});
        client.leave(String(room.id));

        const users_left = await this.manager.query("SELECT COUNT(\"chatId\") as \"left\" FROM \"chat_users\" WHERE \"chatId\" = $1 GROUP BY \"chatId\"", [])
        if (users_left[0].left == 0)
        {
          this.logger.verbose(`no one left in channel ${room.name}. closing.`)
          await this.manager.query("DELETE FROM \"chat\" WHERE \"id\" = $1;", [room.id]);
        }
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

  sendServerCommand(
    server: Server,
    client: Socket,
    user: UserType,
  ) {

  }

}
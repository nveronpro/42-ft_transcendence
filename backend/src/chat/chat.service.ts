import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { User as UserType } from '../../src/users/entities/user.entity';
import { ColumnTypeUndefinedError, Connection, EntityManager } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {genSalt, hash, compare} from 'bcrypt';
import { Chat } from './entities/chat.entity';
import { UserRole } from './entities/userStatus.enum';
import { User } from 'src/auth/decorators/user.decorator';
import { ChatUsers } from './entities/chatUsers.entity';
import { CreateChatUserDto } from './dto/create-chatUsers.dto';
import { inspect } from 'util';
import { Block } from '../friends/entities/block.entity';
import { strict } from 'assert/strict';



@Injectable()
export class ChatService {
  constructor(private manager: EntityManager, private connection: Connection) { }
  private readonly logger = new Logger(ChatService.name);

  // +---------------------------------------------------------+
  // |                      CONTROLLER                         |
  // +---------------------------------------------------------+

  async getAllPublicChats(user: UserType) {
    //this.logger.log("getAllPublicChat. user id:'" + user.id + "'");
    const res = await this.manager.query('SELECT * from chat WHERE "id" NOT IN (SELECT "id" FROM chat JOIN chat_users ON chat.id = chat_users."chatId" WHERE "userId" = $1)', [user.id]);

    return (res);
  }

  async block(user: UserType, id: number) {
    try {
      this.manager.query("INSERT INTO \"block\" VALUES ($1, $2);", [user.id, id]);
    }
    catch (error) {
			this.logger.error("block: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
      return ("an error occured");
		}
  }

  async unblock(user: UserType, id: number) {
    try {
      this.manager.query('DELETE FROM "block" WHERE "blockerId" = $1 AND "blockedId" = $2;', [user.id, id]);
    }
    catch (error) {
			this.logger.error("unblock: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
      return ("an error occured");
		}
  }

  async blockedUsers(user: UserType) {
    const blocked = await this.manager.query('SELECT "user"."login", "user"."id" FROM "block" JOIN "user" ON "block"."blockedId" = "user"."id" WHERE "blockerId" = $1;', [user.id]);
    return (blocked);
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
    // this.logger.debug("socketId: " + sock.id);
    const updateWinner = await this.manager.query("UPDATE \"user\" SET \"socketId\" = $1 WHERE \"id\" = $2;", [sock.id, user.id]);
    return ;
  }

  async disconnectUser(server: Server, client: Socket, user: UserType) {
    //Sending to all channels the left message
    const userChats = await this.manager.query("SELECT * FROM \"chat_users\" WHERE \"userId\" = $1 AND \"userRole\" <> $2", [user.id, UserRole.BANNED]);
    let chat: any;

    for (chat in userChats) {
      this.leaveRoom(server, client, user, userChats[chat].chatId);
    }
  }

  async createPublicRoom(
    server: Server,
    client: Socket,
    user: UserType,
    roomName: string,
    password?: string | undefined
  ) {
    try {
      if (roomName.length < 3) {
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
      // if (target.current_status == "offline")
      // {
      //   this.logger.debug("User is offline");
      //   client.emit("error", {text: `the User ${target.nickname} is offline. unable to send message`});
      //   return ;
      // }

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

      this.logger.debug("BEFORE FIRST JOIN");
      client.join(String(room.id));
      this.logger.debug("AFTER FIRST, BEFORE SECOND");
      //this.logger.debug(inspect(server.sockets.sockets.get(client.id), null, 2));
      this.logger.debug("socketId: " + target.socketId);
      this.logger.debug("target socket: " + server.sockets.sockets.get(target.socketId));
      server.sockets.sockets.get(target.socketId).join(String(room.id));
      this.logger.debug("AFTER SECOND");

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
        this.logger.error(`joinRoom: User#${user.login} tried to join room#${roomId} but it doesn't exist !`);
        client.emit("error", {text: "You can not join this room !"});
        return ;
      }

      if (room.private === true) {
        this.logger.error(`joinRoom: User#${user.login} tried to join room#${roomId} but it is a private room !`);
        client.emit("error", {text: "You can not join this room for it is private !"});
        return ;
      }
      const isUserInChannelOrBanned: ChatUsers = (await this.manager.query("SELECT * FROM \"chat_users\" WHERE \"chatId\" = $1 AND \"userId\" = $2;", [roomId, user.id]))[0];



      if (isUserInChannelOrBanned !== undefined)
      {
        this.logger.warn(`joinRoom: User#${user.id} tried to join room#${roomId} but can't. he is either banned or already in it`);
        client.emit("error", {text: "You can not join this room becaus eeither you're already in it or banned !"});
        return ;
      }

      //join room !
      if (room.password != undefined && await compare(password, room.password) == false ) {
        client.emit("error", {text: "You can not join this room: Wrong Password !"});
        return ;
      }
      await this.manager.query("INSERT INTO \"chat_users\" (\"userId\", \"chatId\") VALUES ($1, $2) ;", [user.id, roomId]);
      client.join(String(room.id));
      client.emit("open", {id: room.id, name: room.name});
      server.to(String(room.id)).emit("message", {login: "Server", destination: roomId, text: `User ${user.nickname} has joined the chat`});
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

      if (room == undefined) { // the room does not exist. wout ?
        this.logger.error(`leaveRoom: User#${user.login} tried to leave room#${roomId} but it doesn't exists`);
        return ;
      }
      else {
        await this.manager.query("DELETE FROM \"chat_users\" WHERE \"userId\"=$1 AND \"chatId\"=$2;", [user.id, roomId]);
        server.to(String(roomId)).emit("message", {login: "Server", destination:room.name, text:`User ${user.nickname} has joined the chat`});
        client.emit("close", {destination: room.name, text: "You have left the room"});
        client.leave(String(room.id));

        const users_left = await this.manager.query("SELECT * FROM \"chat_users\" WHERE \"chatId\" = $1 AND \"userRole\" <> $2", [room.id, UserRole.BANNED])
        if (users_left[0] == undefined)
        {
          this.logger.verbose(`no one left in channel ${room.name}. closing.`)
          await this.manager.query("DELETE FROM \"chat\" WHERE \"id\" = $1;", [room.id]);
        }
      }
    } catch (error) {
			this.logger.error("leaveRoom: An error has occured. Please check the database (or something). See error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
  }

    // ALL
    // profile

    // ADMIN
    
    // mute
    // kick
    // ban

    // OWNER
    // password
    //    set [new_pass]
    //    unset
    // promote [user]
    // demote [user]
    // close

  async timed_unmute(
    server: Server,
    client: Socket,
    user: UserType,
    destination: string
  )
  {
    
  }

  timed_unban(
    server: Server,
    client: Socket,
    user: UserType,
    destination: string,
    duration: number
  )
  {
    
  }

  async sendServerCommand(
    server: Server,
    client: Socket,
    user: UserType,
    args: any[])
  {
    try {
      const allCommands: string[] = ["/profile", "/mute", "/unmute", "/kick", "/ban", "/unban", "/password", "/promote", "/demote", "/close"];
      const command: String = args[0].command;
      const roomId: String = args[0].destination;
      
      let userPerms: ChatUsers = (await this.manager.query('SELECT * FROM "chat_users" WHERE "chatId" = $1 AND "userId" = $2;', [roomId, user.id]))[0];

      let target: UserType;
      let targetChat: ChatUsers;
      // let targetRole: UserRole;

      this.logger.debug("command: \"" + command + "\"");

      if (userPerms.userRole === undefined || userPerms.userRole === UserRole.BANNED || userPerms.userRole === UserRole.MUTED)
      {
        // ERROR HOW TF WAS THIS COMMAND SENT ?!
        this.logger.error("sendServerCommand: An invali user has tried to send a command");
        return ;
      }
      else if (allCommands.find(e => e == command) == undefined)
      {
        client.emit("error", {destination: roomId, text: "Invalid command"});
        this.logger.log(`command: ${command}: invalid command`);
        return ;
      }
      else if (command == "/profile")
      {
        if (args[0].argument0 !== undefined)
        {
          target = await UserType.findOne({nickname: args[0].argument0});
          if (target === undefined)
          {
            client.emit("error", {destination: roomId, text: `command: ${command}: target does not exists`});
            this.logger.log(`command: ${command}: target does not exists`);
            return ;
          }
          targetChat = await ChatUsers.findOne({chat: args[0].destination, user: target});
          if (targetChat === undefined || targetChat.userRole === UserRole.BANNED)
          {
            client.emit("error", {destination: roomId, text: `command: ${command}: target is not on channel`});
            this.logger.log(`command: ${command}: target is not on channel`);
            return ;
          }
        }
        else
        {
          target = user;
        }
        target.id = null;
        target.current_status = null;
        target.two_factor_auth = null;
        target.secret = null;
        target.qrcode_data = null;
        target.socketId = null;

        server.to(String(roomId)).emit("profile", {destination: roomId, target:target});
      }

      else if (userPerms.userRole === UserRole.USER)
      {
        client.emit("error", {destination: roomId, text: `command: ${command}: you do not have the permissions to use this command`});
        return ;
      }

      else if (command == "/mute")
      {
        target = await UserType.findOne({nickname: args[0].argument0});
        if (target === undefined)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target does not exists`});
            this.logger.log(`command: ${command}: target does not exists`);
          return ;
        }
        targetChat = await ChatUsers.findOne({chat: args[0].destination, user: target});
        if (targetChat === undefined|| targetChat.userRole === UserRole.BANNED)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target is not on channel`});
          this.logger.log(`command: ${command}: target is not on channel`);
          return ;
        }
        if (userPerms.userRole != UserRole.OWNER && (targetChat.userRole == UserRole.ADMIN || targetChat.userRole == UserRole.OWNER))
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: you do not have the permissions to use this command on this user`});
          this.logger.log(`command: ${command}: you do not have the permissions to use this command on this user`);
          return ;
        }
        this.manager.query("UPDATE \"chat_users\" SET \"userRole\" = $1 WHERE \"userId\" = $2 AND \"chatId\" = $3;", [UserRole.MUTED, target.id, roomId]);
        server.sockets.sockets.get(String(target.socketId)).emit("mute", {destination: roomId, actif: true});

        if(args[0].argument1 !== undefined && typeof(args[0].argument1) == "number" && args[0].argument1 > 0)
        {
          setTimeout(() => {
            const still_muted = this.manager.query('SELECT * FROM "chat_users" WHERE "userId" = $1 AND "chatId" = $2;', [target.id, roomId]);
            if (still_muted[0] === undefined || still_muted[0].userRole !== UserRole.MUTED)
            {
              //user not muted anymore
              return;
            }
            else
            {
              this.manager.query("UPDATE \"chat_users\" SET \"userRole\" = $1 WHERE \"userId\" = $2 AND \"chatId\" = $3;", [UserRole.USER, target.id, roomId]);
              server.sockets.sockets.get(String(target.socketId)).emit("mute", {destination: roomId, actif: false});
            }
          }, args[0].argument1 * 1000);
        }
      }
      else if (command == "/unmute")
      {
        target = await UserType.findOne({nickname: args[0].argument0});
        if (target === undefined)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target does not exists`});
            this.logger.log(`command: ${command}: target does not exists`);
          return ;
        }
        targetChat = await ChatUsers.findOne({chat: args[0].destination, user: target});
        if (targetChat === undefined|| targetChat.userRole === UserRole.BANNED)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target is not on channel`});
          this.logger.log(`command: ${command}: target is not on channel`);
          return ;
        }

        if (targetChat.userRole !== UserRole.MUTED)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target is not muted`});
          this.logger.log(`command: ${command}: target is not muted`);
          return ;
        }
        this.manager.query("UPDATE \"chat_users\" SET \"userRole\" = $1 WHERE \"userId\" = $2 AND \"chatId\" = $3;", [UserRole.USER, target.id, roomId]);
        server.sockets.sockets.get(String(target.socketId)).emit("mute", {destination: roomId, actif: false});
      }
      else if (command == "/kick")
      {
        target = await UserType.findOne({nickname: args[0].argument0});
        if (target === undefined)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target does not exists`});
            this.logger.log(`command: ${command}: target does not exists`);
          return ;
        }
        targetChat = await ChatUsers.findOne({chat: args[0].destination, user: target});
        if (targetChat === undefined|| targetChat.userRole === UserRole.BANNED)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target is not on channel`});
          this.logger.log(`command: ${command}: target is not on channel`);
          return ;
        }
        if (userPerms.userRole != UserRole.OWNER && (targetChat.userRole == UserRole.ADMIN || targetChat.userRole == UserRole.OWNER))
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: you do not have the permissions to use this command on this user`});
          this.logger.log(`command: ${command}: you do not have the permissions to use this command on this user`);
          return ;
        }
        server.sockets.sockets.get(String(target.socketId)).leave(String(roomId));
        this.manager.query("DELETE FROM \"chat_users\" WHERE \"userId\" = $1 AND \"chatId\" = $2;", [target.id, roomId]);
        server.sockets.sockets.get(String(target.socketId)).emit("close", {destination: roomId, text: "you have been kicked out of the room."});
        server.to(String(roomId)).emit("message", {destination: roomId, text:`User ${target.nickname} has left the chat`})
      }
      else if (command == "/ban")
      {
        target = await UserType.findOne({nickname: args[0].argument0});
        if (target === undefined)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target does not exists`});
            this.logger.log(`command: ${command}: target does not exists`);
          return ;
        }
        
        targetChat = await ChatUsers.findOne({chat: args[0].destination, user: target});
        if (targetChat === undefined || targetChat.userRole === UserRole.BANNED)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target is not on channel`});
          this.logger.log(`command: ${command}: target is not on channel`);
          return ;
        }

        if (userPerms.userRole != UserRole.OWNER && (targetChat.userRole == UserRole.ADMIN || targetChat.userRole == UserRole.OWNER))
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: you do not have the permissions to use this command on this user`});
          this.logger.log(`command: ${command}: you do not have the permissions to use this command on this user`);
          return ;
        }
        server.sockets.sockets.get(String(target.socketId)).leave(String(roomId));
        this.manager.query("UPDATE \"chat_users\" SET \"userRole\" = $1 WHERE \"userId\" = $2 AND \"chatId\" = $3;", [UserRole.BANNED, target.id, roomId]);
        server.sockets.sockets.get(String(target.socketId)).emit("close", {destination: roomId, text: "you have been kicked out of the room."});
        server.to(String(roomId)).emit("message", {destination: roomId, text:`User ${target.nickname} has left the chat(ban)`});

        if(args[0].argument1 !== undefined && typeof(args[0].argument1) == "number" && args[0].argument1 > 0)
        {
          setTimeout(() => {
            const still_muted = this.manager.query('SELECT * FROM "chat_users" WHERE "userId" = $1 AND "chatId" = $2;', [target.id, roomId]);
            if (still_muted[0] === undefined || still_muted[0].userRole !== UserRole.BANNED)
            {
              //user not Banned anymore
              return;
            }
            else
            {
              this.manager.query("DELETE FROM \"chat_users\" WHERE \"userId\" = $1 AND \"chatId\" = $2;", [target.id, roomId]);
              server.sockets.sockets.get(String(target.socketId)).emit("mute", {destination: roomId, actif: false});
            }
          }, args[0].argument1 * 1000);
        }
      }
      else if (command == "/unban")
      {
        target = await UserType.findOne({nickname: args[0].argument0});
        if (target === undefined)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target does not exists`});
            this.logger.log(`command: ${command}: target does not exists`);
          return ;
        }

        targetChat = await ChatUsers.findOne({chat: args[0].destination, user: target});
        if (targetChat === undefined)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target is not banned`});
          this.logger.log(`command: ${command}: target is not banned`);
          return ;
        }

        this.manager.query("DELETE FROM \"chat_users\" WHERE \"userId\" = $1 AND \"chatId\" = $2;", [target.id, roomId]);
      }

      else if (userPerms.userRole === UserRole.ADMIN)
      {
        client.emit("error", {destination: roomId, text: `command: ${command}: you do not have the permissions to use this command`});
        return ;
      }

      else if (command === "/promote")
      {
        target = await UserType.findOne({nickname: args[0].argument0});
        if (target === undefined)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target does not exists`});
            this.logger.log(`command: ${command}: target does not exists`);
          return ;
        }
        targetChat = await ChatUsers.findOne({chat: args[0].destination, user: target});
        if (targetChat === undefined|| targetChat.userRole === UserRole.BANNED)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target is not on channel`});
          this.logger.log(`command: ${command}: target is not on channel`);
          return ;
        }
        if (targetChat.userRole == UserRole.OWNER)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: you do not have the permissions to use this command on this user`});
          this.logger.log(`command: ${command}: you do not have the permissions to use this command on this user`);
          return ;
        }
        this.manager.query("UPDATE \"chat_users\" SET \"userRole\" = $1 WHERE \"userId\" = $2 AND \"chatId\" = $3;", [UserRole.ADMIN, target.id, roomId]);
        server.sockets.sockets.get(String(target.socketId)).emit("admin", {destination: roomId, actif: true});

        // TODO should I send a message to the user ?
      }
      else if (command === "/demote")
      {
        target = await UserType.findOne({nickname: args[0].argument0});
        if (target === undefined)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target does not exists`});
            this.logger.log(`command: ${command}: target does not exists`);
          return ;
        }
        targetChat = await ChatUsers.findOne({chat: args[0].destination, user: target});
        if (targetChat === undefined|| targetChat.userRole === UserRole.BANNED)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: target is not on channel`});
          this.logger.log(`command: ${command}: target is not on channel`);
          return ;
        }
        if (targetChat.userRole != UserRole.ADMIN)
        {
          client.emit("error", {destination: roomId, text: `command: ${command}: User can't be demoted for it isn't an admin`});
          this.logger.log(`command: ${command}:  User can't be demoted for it isn't an admin`);
          return ;
        }
        this.manager.query("UPDATE \"chat_users\" SET \"userRole\" = $1 WHERE \"userId\" = $2 AND \"chatId\" = $3;", [UserRole.USER, target.id, roomId]);
        server.sockets.sockets.get(String(target.socketId)).emit("admin", {destination: roomId, actif: false});
      }
      else if (command === "/password")
      {
        let newPass: string;
        if (args[0].argument0 == "set")
        {
          if (args[0].argument1 === undefined)
          {
            client.emit("error", {destination: roomId, text: `command: ${command}: Missing new password.`});
            this.logger.log(`command: ${command}: Missing new password.`);
            return ;
          }

          const saltOrRound = 12;
          const salt = await genSalt(saltOrRound);
          newPass = await hash(args[0].argument1, salt);
        }
        else if (args[0].argument1 == "unset")
        {
          newPass = null;
        }

        this.manager.query('UPDATE "chat" SET "password" = $1 WHERE "id" = $2;', [newPass, roomId]);
      }
      else if (command === "/close")
      {
        server.to(String(roomId)).emit("close", {destination: roomId, text: "The room has been closed"});
        const chatUsers = await await server.to(String(roomId)).allSockets();
        chatUsers.forEach(data=> {
          server.sockets.sockets.get(data).leave(String(roomId));
        });
        this.manager.query('DELETE FROM "chat_users" WHERE "chatId" = $1;', [roomId]);
        this.manager.query('DELETE FROM "chat" WHERE "id" = $1;', [roomId]);
      }
      else
      {
        this.logger.log(`command: ${command}: the command was not found ?...`);
      }
    } catch (error) {
			this.logger.error("checkCommandValidity: An error has occured. Please check the error for more informations.");
			this.logger.error(error);
			return ("An error has occured. Please check the database (or something).");
		}
  }

}
import { Logger, UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../../src/auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { User as UserType } from '../../src/users/entities/user.entity';
import { inspect } from 'util';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {Response, Request} from 'express';

@WebSocketGateway(
  {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  }
)
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private server: Server;

  afterInit(Server: any){
    this.logger.log('Initialized !');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected ${client.id}`);
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.logger.log(`Client disconnected ${client.id}`);
  }


  // TODO check all parameters are well defined


  @SubscribeMessage('createGroupChat')
  async createPublicRoom( client: Socket, ...args: any[] ) {
    let roomName = args[0].destination;
    let login = args[0].login;
    let password = args[0].password;

    this.logger.verbose("WebSocket/createGroupChat");
    
    const user: UserType = await this.chatService.getUserLogin(args[0].login);
    if (user === undefined)
    {
      this.logger.error(`createPublicRoom: The user ${login} can not be found`)
      client.emit("error", "an error has occured");
      return ;
    }
    else if (roomName === undefined)
    {
      this.logger.error(`createPublicRoom: a parameter is missing`)
      client.emit("error", "an error has occured");
      return ;
    }
    this.chatService.createPublicRoom(this.server, client, user, roomName, password);
  }

  @SubscribeMessage('createPrivateChat')
  async createPrivateRoom( client: Socket, ...args: any[] ) {
    let login = args[0].login
    let userId = args[0].user;
    const user: UserType = await this.chatService.getUserLogin(login);

    this.logger.verbose("WebSocket/createPrivateChat");

    if (user === undefined)
    {
      this.logger.error(`createPrivateRoom: The user ${login} can not be found`)
      client.emit("error", "an error has occured");
      return ;
    }
    else if (userId === undefined)
    {
      this.logger.error(`createPrivateRoom: a parameter is missing`)
      client.emit("error", "an error has occured");
      return ;
    }

    this.chatService.createPrivateRoom(this.server, client, user, userId);
  }

  @SubscribeMessage('joinChat')
  async joinRoom( client: Socket, ...args: any[] ) {
    let login = args[0].login;
    let roomId = args[0].destination;
    let password = args[0].password;
    const user: UserType = await this.chatService.getUserLogin(login);

    this.logger.verbose("WebSocket/joinChat");

    if (user === undefined)
    {
      this.logger.error(`joinRoom: The user ${login} can not be found`)
      client.emit("error", "an error has occured");
      return ;
    }
    else if (roomId === undefined)
    {
      this.logger.error(`joinRoom: a parameter is missing`)
      client.emit("error", "an error has occured");
      return ;
    }

    this.chatService.joinRoom(this.server, client, user, roomId, password);
  }

  @SubscribeMessage('msgToServer')
  async msgToServer(client: Socket, ...args: any[] ) {
    let login = args[0].login;
    let roomId = args[0].destination;
    let message = args[0].text;
    const user: UserType = await this.chatService.getUserLogin(login);

    this.logger.verbose("WebSocket/msgToServer");

    if (user === undefined)
    {
      this.logger.error(`msgToServer: The user ${login} can not be found`)
      client.emit("error", "an error has occured");
      return ;
    }
    else if (roomId === undefined)
    {
      this.logger.error(`msgToServer: a parameter is missing`)
      client.emit("error", "an error has occured");
      return ;
    }
    else if (message === undefined)
    {
      this.logger.error(`msgToServer: a parameter is missing`)
      client.emit("error", "an error has occured");
      return ;
    }

    this.chatService.msgToServer(this.server, client, user, roomId, message);
  }

  @SubscribeMessage('leave')
  async leaveChannel(client: Socket, ...args: any[] ) {
    let login = args[0].login;
    let roomId = args[0].destination;
    const user: UserType = await this.chatService.getUserLogin(login);

    this.logger.verbose("WebSocket/leave");

    if (user === undefined)
    {
      this.logger.error(`leaveChannel: The user ${login} can not be found`)
      client.emit("error", "an error has occured");
      return ;
    }
    else if (roomId === undefined)
    {
      this.logger.error(`leaveChannel: a parameter is missing`)
      client.emit("error", "an error has occured");
      return ;
    }
    this.chatService.leaveRoom(this.server, client, user, roomId);
  }

}

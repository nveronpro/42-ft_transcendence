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
  async createPublicRoom(
    client: Socket,
    @MessageBody('login') login: string,
    @MessageBody('roomName') roomName: string | undefined,
    @MessageBody('password') password: string | undefined
  ) {
    const user: UserType = await this.chatService.getUserLogin(login);

    if (user === undefined)
    {
      this.logger.error(`createPublicRoom: The user ${login} can not be found`)
      //TODO emit an error has occured 
      return ;
    }
    this.chatService.createPublicRoom(this.server, client, user, roomName, password);
  }

  @SubscribeMessage('createPrivateChat')
  async createPrivateRoom(
    client: Socket,
    @MessageBody('login') login: string,
    @MessageBody('user') userId: number
  ) {
    const user: UserType = await this.chatService.getUserLogin(login);

    if (user === undefined)
    {
      this.logger.error(`createPublicRoom: The user ${login} can not be found`)
      //TODO emit an error has occured 
      return ;
    }

    this.chatService.createPrivateRoom(this.server, client, user, userId);
  }

  @SubscribeMessage('joinChat')
  async joinRoom(
    client: Socket,
    @MessageBody('login') login: string,
    @MessageBody('roomId') roomId: number,
    @MessageBody('password') password: string | undefined
  ) {
    const user: UserType = await this.chatService.getUserLogin(login);

    if (user === undefined)
    {
      this.logger.error(`createPublicRoom: The user ${login} can not be found`)
      //TODO emit an error has occured 
      return ;
    }

    this.chatService.joinRoom(this.server, client, user, roomId, password);
  }

  @SubscribeMessage('msgToServer')
  async msgToServer(
    client: Socket,
    @MessageBody('login') login: string,
    @MessageBody('destination') roomId: number,
    @MessageBody('text') message: string | undefined
  ) {
    const user: UserType = await this.chatService.getUserLogin(login);

    if (user === undefined)
    {
      this.logger.error(`createPublicRoom: The user ${login} can not be found`)
      //TODO emit an error has occured 
      return ;
    }

    this.chatService.msgToServer(this.server, client, user, roomId, message);
  }










  //@UseGuards(JwtAuthGuard)
  @SubscribeMessage('test')
  handleTest(client: Socket, data: string) {
    this.logger.debug("THIS IS A TEST. A MESSAGE HAS BEEN SUCCESSFULLY RECEIVED !");

    this.logger.debug("Socket Server");
    //this.logger.debug(client);
    console.log(inspect(this.server.sockets.sockets, false, 1, true));

    this.logger.debug("user");
    //this.logger.debug(user);

    this.logger.debug("data");
    this.logger.debug(data);

    return '';
  }





  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatService.create(createChatDto);
  // }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }


}

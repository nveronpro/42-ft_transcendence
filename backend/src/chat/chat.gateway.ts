import { Logger, UseGuards } from '@nestjs/common';
import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '../../node_modules/@nestjs/websockets';
import { Socket } from '../../node_modules/socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User as UserType } from '../users/entities/user.entity';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  private readonly logger = new Logger(ChatGateway.name);
  
  afterInit() {
    this.logger.debug("Gateway initialised");
  }

  handleConnection (client: Socket) {
    this.logger.debug("Gateway connect");
  }

  handleDisconnect () {
    this.logger.debug("Gateway disconnect");
  }


  


	@UseGuards(JwtAuthGuard)
  @SubscribeMessage('createChannel')
	async createRoom(
    client: Socket,
    @User() user: UserType,
    @MessageBody('roomName') roomName: string,
    @MessageBody('password') password: string | undefined)
  {
    this.chatService.createRoom(user, roomName, password);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinChannel')
	async joinRoom(
    client: Socket,
    @User() user: UserType,
    @MessageBody('roomId') roomId: number,
    @MessageBody('password') password: string | undefined) 
  {
    this.chatService.joinRoom(user, roomId, password);
  }














  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    //return this.chatService.create(createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    //return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    //return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    //return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    //return this.chatService.remove(id);
  }

  @SubscribeMessage('test')
  handleTest(client: Socket, data: string) {
    this.logger.debug("THIS IS A TEST. A MESSAGE HAS BEEN SUCCESSFULLY RECEIVED !");
    this.logger.debug(data);
    return '';
  }
}

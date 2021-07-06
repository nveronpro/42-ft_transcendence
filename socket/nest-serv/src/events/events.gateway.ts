import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
  import { from, Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Server } from 'socket.io';
  
  @WebSocketGateway()
  export class EventsGateway {
    @WebSocketServer()
    server: Server;
    
    @SubscribeMessage('move')
    async identity(@MessageBody() data: number): Promise<number> {
      console.log(data);
      return data;
    }
  }
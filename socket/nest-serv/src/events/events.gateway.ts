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
  import { Pos } from '../interfaces/pos.interface';
  
  @WebSocketGateway()
  export class EventsGateway {
    @WebSocketServer()
    server: Server;

    position: Pos;

    
    @SubscribeMessage('test')
    test(@MessageBody() data: string): void  {
      console.log("New test");
      this.server.emit("test", data);
    }

    @SubscribeMessage('move')
    async move(@MessageBody() data: string): Promise<string> {
      console.log(data);
      return data;
    }
  }
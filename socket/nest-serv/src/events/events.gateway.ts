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

    
    @SubscribeMessage('connection')
    co()  {
      console.log("New connection");
      this.position.x = 200;
      this.position.y = 200;
      this.server.emit("position", this.position);
    }

    @SubscribeMessage('move')
    async move(@MessageBody() data: string): Promise<string> {
      console.log(data);
      return data;
    }
  }
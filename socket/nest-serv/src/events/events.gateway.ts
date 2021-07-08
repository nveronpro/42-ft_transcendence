import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
    WsResponse,
  } from '@nestjs/websockets';
  import { from, Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Server, Socket } from 'socket.io';
  import { Pos } from '../interfaces/pos.interface';
  import { Coords } from '../interfaces/coords.interface';
  
  @WebSocketGateway()
  export class EventsGateway {
    @WebSocketServer()
    server: Server;

    position: Pos;

    first: boolean;

    
    @SubscribeMessage('new-co')
    newCo(@MessageBody() data: string, @ConnectedSocket() client: Socket): void  {
      console.log(this.first);
      if (this.first == false) {
        client.emit("is-spect", true);
        return ;
      }
      this.first = false;
      client.emit("is-spect", false);
    }

    @SubscribeMessage('bar')
    bar(@MessageBody() data: number): void  {
      console.log(data);
      this.server.emit("move-bar", data);
    }

    @SubscribeMessage('move')
    move(@MessageBody() coords: Coords): void  {
      coords.posX += coords.vxBall;
      coords.posY += coords.vyBall;
      if (
        coords.posY <= coords.barY + 100 &&
        coords.posY >= coords.barY &&
        coords.posX <= 15 && coords.posX >= 0
      ) {
        coords.vxBall = -coords.vxBall;
      }
      else if (coords.posX + coords.vxBall < 0) {
        coords.moving = false;
        coords.posX = 250;
        coords.posY = 0;
        coords.barX = 0;
        coords.barY = 220;
        return;
      }
      if (coords.moving) {
        if (coords.posY + coords.vyBall < 0) {
          coords.vyBall = -coords.vyBall;
        }
        if (coords.posY + coords.vyBall > coords.height) {
          coords.vyBall = -coords.vyBall;
        }
        if (coords.posX + coords.vxBall > coords.width) {
          coords.vxBall = -coords.vxBall;
        }
      }
      this.server.emit('new-coords', coords);
    }

  }
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

  first: boolean;
  moving: boolean;

  
  @SubscribeMessage('new-co')
  newCo(@MessageBody() coords: Coords, @ConnectedSocket() client: Socket): void  {
    console.log(this.first);
    if (this.first == false) {
      //coords.spect = true;
      coords.spect = false;
      coords.moving = this.moving;
      client.emit("is-spect", coords);
      return ;
    }
    this.first = false;
    coords.spect = false;
    client.emit("is-spect", coords);
  }

  @SubscribeMessage('be-player')
  bePlayer(@MessageBody() coords: Coords, @ConnectedSocket() client: Socket): void  {
    coords.spect = false;
    client.emit("is-spect", coords);
  }

  @SubscribeMessage('be-spect')
  beSpect(@MessageBody() coords: Coords, @ConnectedSocket() client: Socket): void  {
    coords.spect = true;
    client.emit("is-spect", coords);
  }

  @SubscribeMessage('bar-top')
  barTop(@MessageBody() coords: Coords): void  {
    coords.barY -= 15;
    this.server.emit("new-coords", coords);
  }

  @SubscribeMessage('bar-bottom')
  barBottom(@MessageBody() coords: Coords): void  {
    coords.barY += 15;
    this.server.emit("new-coords", coords);
  }

  @SubscribeMessage('move')
  move(@MessageBody() coords: Coords): void  {
    this.moving = true;
    coords.moving = true;
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
      this.moving = false;
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
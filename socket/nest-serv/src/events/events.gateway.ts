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

  players: number;
  moving: boolean;

  
  @SubscribeMessage('new-co')
  newCo(@MessageBody() coords: Coords, @ConnectedSocket() client: Socket): void  {
    console.log(this.players);
    if (this.players == undefined) {
      this.players = 1;
      client.emit("role", 1);
      return ;
    }
    if (this.players == 1) {
      this.players += 1;
      client.emit("role", 2);
      return ;
    }
    this.players += 1;
    client.emit("role", 0);
  }

  @SubscribeMessage('bar1-top')
  bar1Top(@MessageBody() coords: Coords): void  {
    coords.bar1Y -= 15;
    this.server.emit("new-coords", coords);
  }

  @SubscribeMessage('bar1-bottom')
  bar1Bottom(@MessageBody() coords: Coords): void  {
    coords.bar1Y += 15;
    this.server.emit("new-coords", coords);
  }

  @SubscribeMessage('bar2-top')
  bar2Top(@MessageBody() coords: Coords): void  {
    coords.bar2Y -= 15;
    this.server.emit("new-coords", coords);
  }

  @SubscribeMessage('bar2-bottom')
  bar2Bottom(@MessageBody() coords: Coords): void  {
    coords.bar2Y += 15;
    this.server.emit("new-coords", coords);
  }

  @SubscribeMessage('move')
  move(@MessageBody() coords: Coords): void  {
    console.log('move');
    this.moving = true;
    coords.moving = true;
    coords.posX += coords.vxBall;
    coords.posY += coords.vyBall;
    if (
      coords.posY <= coords.bar1Y + 100 &&
      coords.posY >= coords.bar1Y &&
      coords.posX <= 15 && coords.posX >= 0
    ) {
      coords.vxBall = -coords.vxBall;
    }
    else if (coords.posX + coords.vxBall < 0) {
      this.moving = false;
      coords.moving = false;
      coords.posX = 300;
      coords.posY = 0;
      coords.bar1X = 0;
      coords.bar1Y = 220;
      coords.bar2X = 685;
      coords.bar2Y = 220;
      coords.score2++;
      console.log('score ' + coords.score1 + ' : ' + coords.score2);
      this.server.emit('new-coords', coords);
      return;
    }
    if (
      coords.posY <= coords.bar2Y + 100 &&
      coords.posY >= coords.bar2Y &&
      coords.posX >= 685 && coords.posX <= 700
    ) {
      coords.vxBall = -coords.vxBall;
    }
    else if (coords.posX + coords.vxBall > 700) {
      this.moving = false;
      coords.moving = false;
      coords.posX = 300;
      coords.posY = 0;
      coords.bar1X = 0;
      coords.bar1Y = 220;
      coords.bar2X = 685;
      coords.bar2Y = 220;
      coords.score1++;
      console.log('score' + coords.score1 + ' : ' + coords.score2);
      this.server.emit('new-coords', coords);
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
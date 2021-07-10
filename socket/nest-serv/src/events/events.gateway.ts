import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Coords } from '../interfaces/coords.interface';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  players: number;
  rooms: number;
  moving: boolean;

  clientsNo: number;
  clients: Array<{key: number, socket: Socket}>;

  coordsArray: Array<Coords>;

  handleConnection(client: Socket) {
    if (this.players == undefined)
      this.clientsNo = 0;
      if (this.rooms == undefined)
      this.rooms = 0;
    this.clientsNo++;
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('spect')
  spect(@MessageBody() roomNo: number, @ConnectedSocket() client: Socket): void  {
    client.join(roomNo.toString());
    client.emit("role", {
      totalRooms: this.rooms,
      role: 0,
      room: roomNo.toString()});
      console.log('room : ' + roomNo.toString());
      client.emit('new-coords', this.coordsArray[roomNo]);
}

  @SubscribeMessage('play')
  play(@MessageBody() coords: Coords, @ConnectedSocket() client: Socket): void  {
    if (this.players == undefined) {
      this.players = 1;
      this.rooms = Math.round(this.players / 2);
      client.emit("role", {
        full: false,
        totalRooms: this.rooms,
        role: 1,
        room: Math.round(this.players / 2).toString()});
      client.join(Math.round(this.players / 2).toString());
      this.coordsArray = [];
      coords.room = Math.round(this.players / 2).toString();
      this.coordsArray[Math.round(this.players / 2)] = coords;
    } else {
      this.players++;
      this.rooms = Math.round(this.players / 2);
      if (this.players % 2 == 0) {
        client.emit("role", {
          full: true,
          totalRooms: this.rooms,
          role: 2,
          room: Math.round(this.players / 2).toString()});
        client.join(Math.round(this.players / 2).toString());
        this.server.to(Math.round(this.players / 2).toString()).emit('is-full', true);
        coords.full = true;
        this.coordsArray[Math.round(this.players / 2)] = coords;
      } else {
        client.emit("role", {
          full: false,
          totalRooms: this.rooms,
          role: 1,
          room: Math.round(this.players / 2).toString()});
        client.join(Math.round(this.players / 2).toString());
        this.coordsArray[Math.round(this.players / 2)] = coords;
      }
    }
    this.server.emit('rooms', this.rooms);
    console.log('Players : ' + this.players);
    console.log('Rooms : ' + this.rooms);
  }

  @SubscribeMessage('bar1-top')
  bar1Top(@MessageBody() coords: Coords): void  {
    coords.bar1Y -= 20;
    this.server.to(coords.room).emit("new-coords", coords);
  }

  @SubscribeMessage('bar1-bottom')
  bar1Bottom(@MessageBody() coords: Coords): void  {
    coords.bar1Y += 20;
    this.server.to(coords.room).emit("new-coords", coords);
  }

  @SubscribeMessage('bar2-top')
  bar2Top(@MessageBody() coords: Coords): void  {
    coords.bar2Y -= 20;
    this.server.to(coords.room).emit("new-coords", coords);
  }

  @SubscribeMessage('bar2-bottom')
  bar2Bottom(@MessageBody() coords: Coords): void  {
    coords.bar2Y += 20;
    this.server.to(coords.room).emit("new-coords", coords);
  }

  @SubscribeMessage('move')
  move(@MessageBody() coords: Coords): void  {
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
      this.coordsArray[parseInt(coords.room, 10)] = coords;
      this.server.to(coords.room).emit('new-coords', coords);
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
      console.log('score ' + coords.score1 + ' : ' + coords.score2);
      this.coordsArray[parseInt(coords.room, 10)] = coords;
      this.server.to(coords.room).emit('new-coords', coords);
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
    //this.coordsArray[parseInt(coords.room, 10)] = coords;
    this.server.to(coords.room).emit('new-coords', coords);
  }

}
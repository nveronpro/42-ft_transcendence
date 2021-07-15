import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Coords } from './interfaces/coords.interface';
import { CreateMatchHistoryDto } from './../match-histories/dto/create-match-history.dto';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function initGame(coords: Coords, win: number): Coords {
  coords.moving = false;
  coords.posX = getRandomInt(200, 500);
  coords.posY = 0;
  coords.bar1X = 0;
  coords.bar1Y = 220;
  coords.bar2X = 685;
  coords.bar2Y = 220;
  if (win == 1)
    coords.score1++;
  if (win == 2)
    coords.score2++;
  return coords;
}

@WebSocketGateway(
  {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  }
)
export class PongGateway {
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
    console.log('new connection');
  }

  @SubscribeMessage('spect')
  spect(@MessageBody() roomNo: number, @ConnectedSocket() client: Socket): void  {
    client.join(roomNo.toString());
    client.emit("role", {
      totalRooms: this.rooms,
      role: 0,
      room: roomNo.toString()});
    console.log('Spect room : ' + roomNo.toString());
    client.emit('new-coords', this.coordsArray[roomNo]);
}

  @SubscribeMessage('play')
  play(@MessageBody() coords: Coords, @ConnectedSocket() client: Socket): void  {
    console.log('play');
    if (this.players == undefined) {
      this.players = 0;
      this.coordsArray = [];
    }
    this.players++;
    this.rooms = Math.round(this.players / 2);
    client.emit("role", {
      full: (this.players % 2 == 0 ? true : false),
      totalRooms: this.rooms,
      role: (this.players % 2 == 0 ? 2 : 1),
      room: this.rooms.toString()});
    client.join(this.rooms.toString());
    coords.room = this.rooms.toString();
    this.coordsArray[this.rooms] = coords;
    this.server.emit('rooms', this.rooms);
    if (this.players % 2 == 0)
      this.server.to(this.rooms.toString()).emit('is-full', true);
    console.log('Players : ' + this.players);
    console.log('Rooms : ' + this.rooms);
    console.log('Role : ' + (this.players % 2 == 0 ? 2 : 1));
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
  move(@MessageBody() coords: Coords, @ConnectedSocket() client: Socket): void  {
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
      coords = initGame(coords, 2);
      console.log('score ' + coords.score1 + ' : ' + coords.score2);
      if (coords.score2 > 3) {
        var matchHist = {
          score: coords.score1.toString() + ' - ' + coords.score2.toString(),
          winner: coords.player1,
          looser: coords.player2,
        };
        client.emit('end-game', matchHist);
        coords.end = true;
      }
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
      coords = initGame(coords, 1);
      console.log('score ' + coords.score1 + ' : ' + coords.score2);
      if (coords.score1 > 3) {
        var matchHist = {
          score: coords.score1.toString() + ' - ' + coords.score2.toString(),
          winner: coords.player1,
          looser: coords.player2,
        };
        client.emit('end-game', matchHist);
        coords.end = true;
      }
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
    this.server.to(coords.room).emit('new-coords', coords);
  }

  @SubscribeMessage('replay')
  replay(@MessageBody() coords: Coords): void  {
    coords.end = false;
    coords.score1 = 0;
    coords.score2 = 0;
    this.server.to(coords.room).emit("new-coords", coords);
  }

  @SubscribeMessage('test')
  test(@MessageBody() data: string, @ConnectedSocket() client: Socket): void  {
    console.log(data);
    client.emit('test', 'test message');
  }

}

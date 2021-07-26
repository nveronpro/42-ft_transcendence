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
import { CoordsAndUser } from './interfaces/coords-and-user.interface';
import { UsersController } from '../users/users.controller';
import { CannotAttachTreeChildrenEntityError } from 'typeorm';

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

function endGame(coords: Coords, win: number, client: Socket): Coords {
  if (win == 1) {
    var matchHist = {
      score: coords.score1.toString() + '-' + coords.score2.toString(),
      winner: coords.player1,
      looser: coords.player2,
    };
  }
  if (win == 2) {
    var matchHist = {
      score: coords.score1.toString() + '-' + coords.score2.toString(),
      winner: coords.player2,
      looser: coords.player1,
    };
  }
  client.emit('end-game', matchHist);
  coords.end = true;
  
  return coords;
}

@WebSocketGateway(
  {
    path: '/pong/',
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

  clientsNo: number;
  clients: Array<{key: string, online: Socket}>;

  coordsArray: Array<Coords>;

  handleConnection(client: Socket) {
    if (this.players == undefined) {
      this.clientsNo = 0;
      this.rooms = 0;
    }
    this.server.emit('rooms', this.rooms);
    this.clientsNo++;
    console.log(this.rooms);
    console.log('new connection');
    console.log(client.id);
  }

  @SubscribeMessage('spect')
  spect(@MessageBody() data, @ConnectedSocket() client: Socket): void  {
    client.join(data.room.toString());
    client.emit("role", {
      totalRooms: this.rooms,
      role: 0,
      room: data.room.toString()});
    console.log('Spect room : ' + data.room.toString());
    console.log('Spects array : ' + this.coordsArray[data.room].spects);
    this.coordsArray[data.room].spects.push(data.user.nickname);
    this.coordsArray[data.room].spectsId.push(client.id);
    console.log('Spects array : ' + this.coordsArray[data.room].spects);
    this.server.to(data.room.toString()).emit('new-coords', this.coordsArray[data.room]);
  }

  @SubscribeMessage('play')
  play(@MessageBody() data: CoordsAndUser, @ConnectedSocket() client: Socket): void  {
    console.log('play');
    var user = data.user;
    if (this.players == undefined) {
      this.players = 0;
      this.coordsArray = [];
    }
    this.players++;
    this.rooms = Math.round(this.players / 2);
    var coords = (this.players % 2 == 0 ? this.coordsArray[this.rooms] : data.coords);
    client.emit("role", {
      totalRooms: this.rooms,
      role: (this.players % 2 == 0 ? 2 : 1),
      room: this.rooms.toString()});
    client.join(this.rooms.toString());
    coords.room = this.rooms.toString();
    if (this.players % 2 == 0) {
      coords.player2 = user;
      coords.socketId2 = client.id;
    }
    else {
      coords.player1 = user;
      coords.socketId1 = client.id;
    }
    coords.full = (this.players % 2 == 0 ? true : false);
    this.server.to(this.rooms.toString()).emit('new-coords', coords);
    this.coordsArray[this.rooms] = coords;
    this.server.emit('rooms', this.rooms);
    console.log('Players : ' + this.players);
    console.log('Rooms : ' + this.rooms);
    console.log('Role : ' + (this.players % 2 == 0 ? 2 : 1));
  }

  @SubscribeMessage('normal-bg')
  normalBg(@MessageBody() room: string): void  {
    this.server.to(room).emit('normal-bg', '');
  }

  @SubscribeMessage('green-bg')
  greenBg(@MessageBody() room: string): void  {
    this.server.to(room).emit('green-bg', '');
  }

  @SubscribeMessage('bar1-top')
  bar1Top(@MessageBody() room: string): void  {
    console.log('bar1-top')
    console.log('bar moving ' + this.coordsArray[parseInt(room, 10)].moving)
    this.coordsArray[parseInt(room, 10)].bar1Y -= 20;
    this.server.to(room).emit('new-coords', this.coordsArray[parseInt(room, 10)]);
  }

  @SubscribeMessage('bar1-bottom')
  bar1Bottom(@MessageBody() room: string): void  {
    console.log('bar1-bottom')
    console.log('bar moving ' + this.coordsArray[parseInt(room, 10)].moving)
    this.coordsArray[parseInt(room, 10)].bar1Y += 20;
    this.server.to(room).emit('new-coords', this.coordsArray[parseInt(room, 10)]);
  }

  @SubscribeMessage('bar2-top')
  bar2Top(@MessageBody() room: string): void  {
    console.log('bar2-top')
    this.coordsArray[parseInt(room, 10)].bar2Y -= 20;
    this.server.to(room).emit('new-coords', this.coordsArray[parseInt(room, 10)]);
  }

  @SubscribeMessage('bar2-bottom')
  bar2Bottom(@MessageBody() room: string): void  {
    console.log('bar2-bottom')
    this.coordsArray[parseInt(room, 10)].bar2Y += 20;
    this.server.to(room).emit('new-coords', this.coordsArray[parseInt(room, 10)]);
  }

  @SubscribeMessage('move')
  move(@MessageBody() room: string, @ConnectedSocket() client: Socket): void  {
    if (this.coordsArray == undefined){
      console.log('undefined')
      return ;}
    var coords = this.coordsArray[parseInt(room, 10)];
    if (coords.end == true)
      return ;
    coords.moving = true;
    coords.posX += coords.vxBall;
    coords.posY += coords.vyBall;
    if (
      coords.posY <= coords.bar1Y + 100 &&
      coords.posY >= coords.bar1Y &&
      coords.posX <= 15 && coords.posX >= 0
    )
      coords.vxBall = -coords.vxBall;
    else if (coords.posX + coords.vxBall < 0) {
      this.server.emit('stop-move', 'stop');
      this.coordsArray[parseInt(room, 10)].moving = false;
      coords = initGame(coords, 2);
      console.log('score ' + coords.score1 + ' : ' + coords.score2);
      if (coords.score2 > 2)
        coords = endGame(coords, 2, client);
    }
    if (
      coords.posY <= coords.bar2Y + 100 &&
      coords.posY >= coords.bar2Y &&
      coords.posX >= 685 && coords.posX <= 700
    )
      coords.vxBall = -coords.vxBall;
    else if (coords.posX + coords.vxBall > 700) {
      this.server.emit('stop-move', 'stop');
      this.coordsArray[parseInt(room, 10)].moving = false;
      coords = initGame(coords, 1);
      console.log('score ' + coords.score1 + ' : ' + coords.score2);
      if (coords.score1 > 2)
        coords = endGame(coords, 1, client);
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
    console.log('move moving ' + coords.moving)
    this.server.to(room).emit('new-coords', coords);
    this.coordsArray[parseInt(room, 10)] = coords;
  }

  @SubscribeMessage('replay')
  replay(@MessageBody() room: string): void  {
    this.coordsArray[parseInt(room, 10)].end = false;
    this.coordsArray[parseInt(room, 10)].score1 = 0;
    this.coordsArray[parseInt(room, 10)].score2 = 0;
    this.server.to(room).emit("new-coords", this.coordsArray[parseInt(room, 10)]);
  }

  @SubscribeMessage('test')
  test(@MessageBody() data: string, @ConnectedSocket() client: Socket): void  {
    console.log('ultim message');
  }

  @SubscribeMessage('normal')
  normal(@MessageBody() room: string, @ConnectedSocket() client: Socket): void  {
    this.coordsArray[parseInt(room, 10)].vxBall = -2;
    this.coordsArray[parseInt(room, 10)].vyBall = 5;
    this.server.to(room).emit("new-coords", this.coordsArray[parseInt(room, 10)]);
  }

  @SubscribeMessage('hard')
  hard(@MessageBody() room: string, @ConnectedSocket() client: Socket): void  {
    console.log('hard')
    this.coordsArray[parseInt(room, 10)].vxBall = -3;
    this.coordsArray[parseInt(room, 10)].vyBall = 7;
    this.server.to(room).emit("new-coords", this.coordsArray[parseInt(room, 10)]);
  }

  @SubscribeMessage('insane')
  insane(@MessageBody() room: string, @ConnectedSocket() client: Socket): void  {
    this.coordsArray[parseInt(room, 10)].vxBall = -4;
    this.coordsArray[parseInt(room, 10)].vyBall = 9;
    this.server.to(room).emit("new-coords", this.coordsArray[parseInt(room, 10)]);
  }

/*   @SubscribeMessage('quit')
  quit(@MessageBody() data, @ConnectedSocket() client: Socket): void  {
    console.log('quit');
    console.log(client.id);
    var coords = this.coordsArray[parseInt(data.coords.room, 10)];
    if (!coords.full)
      this.server.to(coords.room).emit("reset", --this.rooms);
    else {
      if (coords.score1 != 0 || coords.score2 != 0) {
        console.log('cool');
      }
    }
  }
 */


  /*   @SubscribeMessage('disconnecting')
  handleDisconnecting(client: Socket){
    console.log('disconnecting');
    var rooms = Object.keys(client.rooms);

    rooms.forEach(function(room){
      console.log(room);
    });

  }
  handleDisconnect(client: Socket){
    console.log('disconnect');
    console.log(client.rooms);
    var role = -1;
    var room = 1;
    for (room = 1; room <= this.rooms; room++) {
      if (this.coordsArray[room].spectsId.includes(client.id)) {
        role = 0;
        break;
      }
      if (this.coordsArray[room].socketId1 == client.id) {
        role = 1;
        break;
      }
      if (this. coordsArray[room].socketId2 == client.id) {
        role = 2;
        break;
      }
    }
    if (role == -1)
      return ;
    if (role == 0)
      this.coordsArray[room].spectsId = this.coordsArray[room].spectsId.filter(val => val !== client.id);
    if (!this.coordsArray[room].full) {
      delete this.coordsArray[room];
      //var clients = this.server.adapter.rooms
    }
    //this.server.emit('unjoin', client.id);
  }
 */


}

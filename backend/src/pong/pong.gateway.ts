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
import { RoomsSockets } from './interfaces/room-sockets.interface';
import { User } from '../users/entities/user.entity';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function arrayRemove(arr, value) { 
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

function resetRoomsSockets(): RoomsSockets { 
  var roomsSockets = {
    player1: null,
    player2: null,
    spects: []
  };
  return roomsSockets;
}

function resetAllGame(): Coords {
  var coords = {
    player1: null, // Player1 user object
    player2: null, // Player2 user object
    spects: [], // Spects nicknames array
    socketId1: '', // Socket Id of the player1
    socketId2: '', // Socket Id of the player2
    spectsId: [], // Spects socket Ids array
    moving: false,
    room: '-1',
    height: 500,
    width: 700,
    posX: getRandomInt(200, 500),
    posY: 0,
    bar1X: 0,
    bar1Y: 220,
    bar2X: 685,
    bar2Y: 220,
    vxBall: -3,
    vyBall: 7,
    score1: 0,
    score2: 0,
    full: false,
    end: false,
    bar1Top: false,
    bar1Bottom: false,
    bar2Top: false,
    bar2Bottom: false,
}
  return coords;
}

function shiftRooms(coordsArray, roomsSockets, room, server) {
  if (roomsSockets.length == 2) {
    var rs = [];
    rs.push(null);
    return {
      roomsSockets: rs,
      coordsArray: []
    }
  }

  roomsSockets.splice(room, 1);
  coordsArray.splice(room, 1);

  if (room == roomsSockets.length) {
    return {
      roomsSockets: roomsSockets,
      coordsArray: coordsArray
    }
  }

  for (var i = room; i < roomsSockets.length; i++) {
    coordsArray[i].room = (i).toString();
    roomsSockets[i].spects.forEach(sock => {
      sock.leave((i+1).toString());
      sock.join((i).toString());});
    roomsSockets[i].player1.leave((i+1).toString());
    roomsSockets[i].player1.join((i).toString());
    if (roomsSockets[i].player2 != null) {
      roomsSockets[i].player2.leave((i+1).toString());
      roomsSockets[i].player2.join((i).toString());
    }
    server.to(i.toString()).emit('new-coords', coordsArray[i]);
  }

  return {
    roomsSockets: roomsSockets,
    coordsArray: coordsArray
  }
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

  coordsArray: Array<Coords>;

  roomsSockets: Array<RoomsSockets>;

  privateRooms;

  privateSockets;

  clientsSockets;

  handleConnection(client: Socket) {
    if (this.clientsSockets == undefined)
      this.clientsSockets = {};
    if (this.privateSockets == undefined)
      this.privateSockets = {};
    if (this.privateRooms == undefined)
      this.privateRooms = {};
    if (this.players == undefined) {
      this.rooms = 0; 
    }
    this.server.emit('init', null);
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('spect')
  spect(@MessageBody() data, @ConnectedSocket() client: Socket): void  {
    client.join(data.room.toString());
    client.emit("role", {
      totalRooms: this.rooms,
      role: 0,
      room: data.room.toString()});
    this.coordsArray[data.room].spects.push(data.user.nickname);
    this.coordsArray[data.room].spectsId.push(client.id);
    this.roomsSockets[data.room].spects.push(client);
    this.server.to(data.room.toString()).emit('new-coords', this.coordsArray[data.room]);
  }

  @SubscribeMessage('init')
  init(@MessageBody() user: number, @ConnectedSocket() client: Socket): void  {
    this.clientsSockets[user] = client;
  }

  @SubscribeMessage('play')
  play(@MessageBody() data: CoordsAndUser, @ConnectedSocket() client: Socket): void  {
    var user = data.user;
    if (this.players == undefined) {
      this.players = 0;
      this.coordsArray = [];
      this.roomsSockets = [];
      this.roomsSockets.push(null);
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
      this.roomsSockets[this.rooms].player2 = client;
    }
    else {
      coords.player1 = user;
      coords.socketId1 = client.id;
      coords.spectsId = [];
      this.roomsSockets.push({
        player1: client,
        player2: null,
        spects: []
      })
    }
    coords.full = (this.players % 2 == 0 ? true : false);
    this.server.to(this.rooms.toString()).emit('new-coords', coords);
    this.coordsArray[this.rooms] = coords;
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('create-private')
  async createPrivate(@MessageBody() data) {
    if (this.privateRooms[room] != undefined)
      return ;
    var player1 = await User.findOne({nickname:data.login1});
    var player2 = await User.findOne({nickname:data.login2});
    if ((player1 && player1.current_status != 'online') || (player2 && player2.current_status != 'online'))
      return ;
    var client = this.clientsSockets[data.userId];
    var room = data.login1 + '-' + data.login2;
    this.privateSockets[client.id] = room;
    client.emit("role", {
      totalRooms: this.rooms,
      role: 1,
      room: room});
    this.privateRooms[room] = {};
    this.privateRooms[room].coords = resetAllGame();
    client.join(room);
    this.privateRooms[room].client1 = this.clientsSockets[data.userId];
    this.privateRooms[room].coords.player1 = await User.findOne({nickname:data.login1});
    this.privateRooms[room].coords.player2 = await User.findOne({nickname:data.login2});
    this.privateRooms[room].coords.socketId1 = client.id;
    this.privateRooms[room].coords.spectsId = [];
    this.privateRooms[room].coords.room = room;
    this.server.to(room).emit('new-coords', this.privateRooms[room].coords);
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('join-private')
  joinPrivate(@MessageBody() data): void  {
    var client = this.clientsSockets[data.userId];
    var room = data.login1 + '-' + data.login2;
    if (this.privateRooms[room] == undefined)
      return ;
    this.privateSockets[client.id] = room;
    client.emit("role", {
      totalRooms: this.rooms,
      role: 2,
      room: room});
    client.join(room);
    this.privateRooms[room].client2 = this.clientsSockets[data.userId];
    this.privateRooms[room].coords.full = true;
    this.privateRooms[room].coords.socketId2 = client.id;
    this.server.to(room).emit('new-coords', this.privateRooms[room].coords);
    this.server.emit('rooms', this.rooms);
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
  bar1Top(@MessageBody() data): void  {
    console.log('bol = '+ data.bol)
    if (!data.room.includes('-'))
      this.coordsArray[parseInt(data.room, 10)].bar1Top = data.bol;
    else
      this.privateRooms[data.room].coords.bar1Top = data.bol;
  }

  @SubscribeMessage('bar1-bottom')
  bar1Bottom(@MessageBody() data): void  {
    if (!data.room.includes('-'))
      this.coordsArray[parseInt(data.room, 10)].bar1Bottom = data.bol;
    else
      this.privateRooms[data.room].coords.bar1Bottom = data.bol;
  }

  @SubscribeMessage('bar2-top')
  bar2Top(@MessageBody() data): void  {
    if (!data.room.includes('-'))
      this.coordsArray[parseInt(data.room, 10)].bar2Top = data.bol;
    else
      this.privateRooms[data.room].coords.bar2Top = data.bol;
  }

  @SubscribeMessage('bar2-bottom')
  bar2Bottom(@MessageBody() data): void  {
    if (!data.room.includes('-'))
      this.coordsArray[parseInt(data.room, 10)].bar2Bottom = data.bol;
    else
      this.privateRooms[data.room].coords.bar2Bottom = data.bol;
  }

  @SubscribeMessage('set-move')
  setMove(@MessageBody() room: string): void  {
    if (!room.includes('-')) {
      this.coordsArray[parseInt(room, 10)].moving = true;
      this.server.to(room).emit('new-coords', this.coordsArray[parseInt(room, 10)]);
    }
    else {
      this.privateRooms[room].coords.moving = true;
      this.server.to(room).emit('new-coords', this.privateRooms[room].coords);
    }
  }

  @SubscribeMessage('move')
  async move(@MessageBody() room: string, @ConnectedSocket() client: Socket)  {
    if ((this.coordsArray == undefined && !room.includes('-')) || (room.includes('-') && this.privateRooms[room].coords == undefined))
      return ;
    var coords = (room.includes('-')) ? this.privateRooms[room].coords : this.coordsArray[parseInt(room, 10)];
    while (true) {
      if (coords.moving == false || coords.end == true)
        return ;
      await sleep(20);
      console.log(coords.bar1Top);
      console.log(coords.bar1Bottom);
      console.log(coords.bar2Top);
      console.log(coords.bar2Bottom);
      if (coords.bar1Top == true && coords.bar1Y > 0)
        coords.bar1Y -= 15;
      if (coords.bar1Bottom == true && coords.bar1Y < coords.height-100)
        coords.bar1Y += 15;
      if (coords.bar2Top == true && coords.bar2Y > 0)
        coords.bar2Y -= 15;
      if (coords.bar2Bottom == true && coords.bar2Y < coords.height-100)
        coords.bar2Y += 15;
      coords.posX += coords.vxBall;
      coords.posY += coords.vyBall;
      if (
        coords.posY <= coords.bar1Y + 100 &&
        coords.posY >= coords.bar1Y &&
        coords.posX <= 15 && coords.posX >= 0
        ) {
          coords.vxBall = -coords.vxBall;
          coords.posX += coords.vxBall;
          coords.posY += coords.vyBall;
        }
        else if (coords.posX + coords.vxBall < 0) {
        coords = initGame(coords, 2);
        if (coords.score2 > 2)
          coords = endGame(coords, 2, client);
      }
      if (
        coords.posY <= coords.bar2Y + 100 &&
        coords.posY >= coords.bar2Y &&
        coords.posX >= 685 && coords.posX <= 700
      ) {
        coords.vxBall = -coords.vxBall;
        coords.posX += coords.vxBall;
        coords.posY += coords.vyBall;
      }
      else if (coords.posX + coords.vxBall > 700) {
        coords = initGame(coords, 1);
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
      this.server.to(room).emit('new-coords', coords);
      if (room.includes('-'))
        this.privateRooms[room].coords = coords;
      else
        this.coordsArray[parseInt(room, 10)] = coords;
    }
  }

  @SubscribeMessage('normal')
  normal(@MessageBody() room: string, @ConnectedSocket() client: Socket): void  {
    var coords = (room.includes('-')) ? this.privateRooms[room].coords : this.coordsArray[parseInt(room, 10)];
    coords.vxBall = -3;
    coords.vyBall = 7;
    this.server.to(room).emit("new-coords", coords);
    if (room.includes('-'))
      this.privateRooms[room].coords = coords;
    else
      this.coordsArray[parseInt(room, 10)] = coords;
  }

  @SubscribeMessage('hard')
  hard(@MessageBody() room: string, @ConnectedSocket() client: Socket): void  {
    var coords = (room.includes('-')) ? this.privateRooms[room].coords : this.coordsArray[parseInt(room, 10)];
    coords.vxBall = -4;
    coords.vyBall = 9;
    this.server.to(room).emit("new-coords", coords);
    if (room.includes('-'))
      this.privateRooms[room].coords = coords;
    else
      this.coordsArray[parseInt(room, 10)] = coords;
  }

  @SubscribeMessage('insane')
  insane(@MessageBody() room: string, @ConnectedSocket() client: Socket): void  {
    var coords = (room.includes('-')) ? this.privateRooms[room].coords : this.coordsArray[parseInt(room, 10)];
    coords.vxBall = -5;
    coords.vyBall = 11;
    this.server.to(room).emit("new-coords", coords);
    if (room.includes('-'))
      this.privateRooms[room].coords = coords;
    else
      this.coordsArray[parseInt(room, 10)] = coords;
  }

  @SubscribeMessage('quit')
  quit(@MessageBody() dat, @ConnectedSocket() client: Socket): void  {
    var role = -1;
    var room = 1;

    // if the player is in a private game
    if (this.privateSockets != undefined && this.privateSockets[client.id] != undefined && this.privateSockets[client.id].includes('-')) {
      var r = this.privateSockets[client.id];
      this.server.to(r).emit('role', {
        role: -1,
        room: '-1',
        totalRooms: this.rooms
      });
      if (this.privateRooms[r] != undefined && this.privateRooms[r].client1 != undefined)
        this.privateRooms[r].client1.leave(r);
      if (this.privateRooms[r] != undefined && this.privateRooms[r].client2 != undefined)
        this.privateRooms[r].client2.leave(r);
      this.privateRooms[r] = undefined;
      return ;
    }
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
    if (role == 0) {
      client.emit('role', {
        role: -1,
        room: '-1',
        totalRooms: this.rooms
      });
      client.emit('new-coords', resetAllGame());
      var index = this.coordsArray[room].spectsId.indexOf(client.id);
      this.roomsSockets[room].spects.splice(index, 1);
      this.coordsArray[room].spects.splice(index, 1);
      this.coordsArray[room].spectsId = arrayRemove(this.coordsArray[room].spectsId, client.id);
      this.server.to(room.toString()).emit('new-coords', this.coordsArray[room]);
      return ;
    }
    if (!this.coordsArray[room].full) {
      this.rooms--;
      this.players--;
      this.server.emit('rooms', this.rooms);
      var coords = resetAllGame();
      this.server.to(room.toString()).emit('role', {
        role: -1,
        room: '-1',
        totalRooms: this.rooms
      });
      this.server.to(room.toString()).emit('new-coords', coords);
      this.roomsSockets[room].spects.forEach(sock => sock.leave(room.toString()));
      this.roomsSockets[room].player1.leave(room.toString());
      var data = shiftRooms(this.coordsArray, this.roomsSockets, room, this.server);
      this.coordsArray = data.coordsArray;
      this.roomsSockets = data.roomsSockets;
      return ;
    }
    if (this.coordsArray[room].score1 != 0 || this.coordsArray[room].score2 != 0) {
      var win = (client.id == this.roomsSockets[room].player1.id) ? 2 : 1;
      var client = (client.id == this.roomsSockets[room].player1.id) ? this.roomsSockets[room].player2 : this.roomsSockets[room].player1;
      endGame(this.coordsArray[room], win, client);
    }
    this.rooms--;
    this.players -= 2;
    this.server.emit('rooms', this.rooms);
    var coords = resetAllGame();
    this.server.to(room.toString()).emit('role', {
      role: -1,
      room: '-1',
      totalRooms: this.rooms
    });
    this.server.to(room.toString()).emit('new-coords', coords);
    this.roomsSockets[room].spects.forEach(sock => sock.leave(room.toString()));
    this.roomsSockets[room].player2.leave(room.toString());
    this.roomsSockets[room].player1.leave(room.toString());
    var data = shiftRooms(this.coordsArray, this.roomsSockets, room, this.server);
    this.coordsArray = data.coordsArray;
    this.roomsSockets = data.roomsSockets;
    return ;
  }

  handleDisconnect(client: Socket){
    var role = -1;
    var room = 1;

    if (this.privateSockets != undefined && this.privateSockets[client.id] != undefined && this.privateSockets[client.id].includes('-')) {
      var r = this.privateSockets[client.id];
      this.server.to(r).emit('role', {
        role: -1,
        room: '-1',
        totalRooms: this.rooms
      });
      if (this.privateRooms[r] != undefined && this.privateRooms[r].client1 != undefined && client.id == this.privateRooms[r].client1.id && this.privateRooms[r].client2)
        this.privateRooms[r].client2.leave(r);
      if (this.privateRooms[r] != undefined && this.privateRooms[r].client2 != undefined && client.id == this.privateRooms[r].client2.id)
        this.privateRooms[r].client1.leave(r);
        this.privateRooms[r] = undefined;
      return ;
    }
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
    if (role == 0) {
      var index = this.coordsArray[room].spectsId.indexOf(client.id);
      this.roomsSockets[room].spects.splice(index, 1);
      this.coordsArray[room].spects.splice(index, 1);
      this.coordsArray[room].spectsId = arrayRemove(this.coordsArray[room].spectsId, client.id);
      this.server.to(room.toString()).emit('new-coords', this.coordsArray[room]);
      return ;
    }
    if (!this.coordsArray[room].full) {
      this.rooms--;
      this.players--;
      this.server.emit('rooms', this.rooms);
      var coords = resetAllGame();
      this.server.to(room.toString()).emit('role', {
        role: -1,
        room: '-1',
        totalRooms: this.rooms
      });
      this.server.to(room.toString()).emit('new-coords', coords);
      this.roomsSockets[room].spects.forEach(sock => sock.leave(room.toString()));
      this.roomsSockets[room].player1.leave(room.toString());
      var data = shiftRooms(this.coordsArray, this.roomsSockets, room, this.server);
      this.coordsArray = data.coordsArray;
      this.roomsSockets = data.roomsSockets;
      return ;
    }
    if (this.coordsArray[room].score1 != 0 || this.coordsArray[room].score2 != 0) {
      var win = (client.id == this.roomsSockets[room].player1.id) ? 2 : 1;
      var client = (client.id == this.roomsSockets[room].player1.id) ? this.roomsSockets[room].player2 : this.roomsSockets[room].player1;
      endGame(this.coordsArray[room], win, client);
    }
    this.rooms--;
    this.players -= 2;
    this.server.emit('rooms', this.rooms);
    var coords = resetAllGame();
    this.server.to(room.toString()).emit('role', {
      role: -1,
      room: '-1',
      totalRooms: this.rooms
    });
    this.server.to(room.toString()).emit('new-coords', coords);
    this.roomsSockets[room].spects.forEach(sock => sock.leave(room.toString()));
    if (client.id == this.roomsSockets[room].player1.id)
      this.roomsSockets[room].player2.leave(room.toString());
    if (client.id == this.roomsSockets[room].player2.id)
      this.roomsSockets[room].player1.leave(room.toString());
    var data = shiftRooms(this.coordsArray, this.roomsSockets, room, this.server);
    this.coordsArray = data.coordsArray;
    this.roomsSockets = data.roomsSockets;
    return ;
  }
}

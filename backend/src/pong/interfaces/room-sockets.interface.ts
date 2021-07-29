import { Socket } from 'socket.io';

export interface RoomsSockets {
    player1: Socket;
    player2: Socket;
    spects: Array<Socket>;
}
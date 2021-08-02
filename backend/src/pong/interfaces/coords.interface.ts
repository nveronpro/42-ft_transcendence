import { User } from "src/users/entities/user.entity";
import { Socket } from 'socket.io';

export interface Coords {
    player1: User;
    player2: User;
    spects: string[];
    socketId1: string;
    socketId2: string;
    spectsId: string[];
    moving: boolean;
    room: string;
    width: number;
    height: number;
    posX: number;
    posY: number;
    bar1X: number;
    bar1Y: number;
    bar2X: number;
    bar2Y: number;
    vxBall: number;
    vyBall: number;
    score1: number;
    score2: number;
    full: boolean;
    end: boolean;
}
import { Server, Socket } from 'socket.io';
import { Coords } from '../interfaces/coords.interface';
export declare class EventsGateway {
    server: Server;
    players: number;
    moving: boolean;
    newCo(coords: Coords, client: Socket): void;
    bar1Top(coords: Coords): void;
    bar1Bottom(coords: Coords): void;
    bar2Top(coords: Coords): void;
    bar2Bottom(coords: Coords): void;
    move(coords: Coords): void;
}

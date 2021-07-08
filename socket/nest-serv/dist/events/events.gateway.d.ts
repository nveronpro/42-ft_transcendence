import { Server, Socket } from 'socket.io';
import { Coords } from '../interfaces/coords.interface';
export declare class EventsGateway {
    server: Server;
    first: boolean;
    moving: boolean;
    newCo(coords: Coords, client: Socket): void;
    barTop(coords: Coords): void;
    barBottom(coords: Coords): void;
    move(coords: Coords): void;
}

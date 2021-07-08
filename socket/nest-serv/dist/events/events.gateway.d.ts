import { Server, Socket } from 'socket.io';
import { Pos } from '../interfaces/pos.interface';
import { Coords } from '../interfaces/coords.interface';
export declare class EventsGateway {
    server: Server;
    position: Pos;
    first: boolean;
    newCo(data: string, client: Socket): void;
    bar(data: number): void;
    move(coords: Coords): void;
}

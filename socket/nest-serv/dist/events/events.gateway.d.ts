import { Server, Socket } from 'socket.io';
import { Coords } from '../interfaces/coords.interface';
export declare class EventsGateway {
    server: Server;
    players: number;
    rooms: number;
    moving: boolean;
    clientsNo: number;
    clients: Array<{
        key: number;
        socket: Socket;
    }>;
    coordsArray: Array<Coords>;
    handleConnection(client: Socket): void;
    spect(roomNo: number, client: Socket): void;
    play(coords: Coords, client: Socket): void;
    bar1Top(coords: Coords): void;
    bar1Bottom(coords: Coords): void;
    bar2Top(coords: Coords): void;
    bar2Bottom(coords: Coords): void;
    move(coords: Coords): void;
}

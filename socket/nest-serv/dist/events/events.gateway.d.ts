import { Server } from 'socket.io';
import { Pos } from '../interfaces/pos.interface';
export declare class EventsGateway {
    server: Server;
    position: Pos;
    co(): void;
    move(data: string): Promise<string>;
}

import { Server } from 'socket.io';
import { Pos } from '../interfaces/pos.interface';
export declare class EventsGateway {
    server: Server;
    position: Pos;
    test(data: string): void;
    move(data: string): Promise<string>;
}

/**
 * Event published when a client is created
 */
export declare class ClientCreatedEvent {
    readonly id: string;
    readonly name: string;
    readonly clientId: string;
    readonly certExpiresAt: Date;
    constructor(id: string, name: string, clientId: string, certExpiresAt: Date);
}

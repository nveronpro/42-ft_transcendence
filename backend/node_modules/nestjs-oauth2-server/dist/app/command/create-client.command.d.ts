/**
 * Command used to create clients
 */
export declare class CreateClientCommand {
    readonly name: string;
    readonly scope: string;
    readonly clientId?: string;
    readonly grants?: string[];
    readonly noSecret?: boolean;
    readonly accessTokenLifetime?: number;
    readonly refreshTokenLifetime?: number;
    constructor(name: string, scope: string, clientId?: string, grants?: string[], noSecret?: boolean, accessTokenLifetime?: number, refreshTokenLifetime?: number);
}

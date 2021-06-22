/**
 * Event generated when an access token is generated
 */
export declare class AccessTokenCreatedEvent {
    readonly id: string;
    readonly clientId: string;
    readonly accessToken: string;
    readonly accessTokenExpiresAt: Date;
    readonly refreshToken: string;
    readonly refreshTokenExpiresAt: Date;
    readonly scope: string;
    readonly userId?: string;
    constructor(id: string, clientId: string, accessToken: string, accessTokenExpiresAt: Date, refreshToken: string, refreshTokenExpiresAt: Date, scope: string, userId?: string);
}

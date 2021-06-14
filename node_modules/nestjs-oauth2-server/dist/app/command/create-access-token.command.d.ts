/**
 * Create an access token
 */
import { OAuth2Request } from "../../ui/dto";
export declare class CreateAccessTokenCommand {
    readonly clientId: string;
    readonly scope: string;
    readonly exp: number;
    readonly iat: number;
    readonly request: OAuth2Request;
    readonly userId?: string;
    constructor(clientId: string, scope: string, exp: number, iat: number, request: OAuth2Request, userId?: string);
}

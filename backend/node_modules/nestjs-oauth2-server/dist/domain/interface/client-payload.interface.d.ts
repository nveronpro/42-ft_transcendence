import { Oauth2PayloadInterface, Oauth2PayloadType } from "./oauth2-payload.interface";
import { AccessTokenEntity } from "../access-token.entity";
/**
 * Represents a client's payload
 */
export declare class ClientPayload implements Oauth2PayloadInterface {
    readonly accessToken: AccessTokenEntity;
    readonly id: string;
    readonly clientId: string;
    readonly name: string;
    readonly type: Oauth2PayloadType;
    constructor(accessToken: AccessTokenEntity, id: string, clientId: string, name: string);
}

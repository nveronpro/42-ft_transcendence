import { AccessTokenEntity } from "../access-token.entity";
import { Oauth2PayloadInterface, Oauth2PayloadType } from "./oauth2-payload.interface";
/**
 * Represents a UserPayload
 */
export declare class UserPayload implements Oauth2PayloadInterface {
    readonly accessToken: AccessTokenEntity;
    readonly id: string;
    readonly username: string;
    readonly email: string;
    /**
     * The current payload type should not be changed as it should always be user in this case
     */
    readonly type: Oauth2PayloadType;
    constructor(accessToken: AccessTokenEntity, id: string, username: string, email: string);
}

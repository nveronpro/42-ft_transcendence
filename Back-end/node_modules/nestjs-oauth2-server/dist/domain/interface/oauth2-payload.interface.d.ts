import { AccessTokenEntity } from "../access-token.entity";
/** define payload types */
export declare enum Oauth2PayloadType {
    CLIENT = "client",
    USER = "user"
}
/**
 * User payloads are used in the guard when the user still finish
 */
export interface Oauth2PayloadInterface {
    readonly type: Oauth2PayloadType;
    readonly accessToken: AccessTokenEntity;
    readonly id: string;
}

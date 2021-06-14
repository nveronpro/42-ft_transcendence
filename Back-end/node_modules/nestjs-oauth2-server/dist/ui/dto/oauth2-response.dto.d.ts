/**
 * Main object used to transport data
 */
export declare class OAuth2Response {
    accessToken: string;
    tokenType: string;
    refreshToken: string;
    accessTokenExp: number;
    refreshTokenExp: number;
    scope?: string;
    /**
     * Main method used to build this object
     *
     * @param accessToken
     * @param refreshToken
     * @param accessTokenExp
     * @param refreshTokenExp
     * @param scope
     */
    constructor(accessToken: string, refreshToken: string, accessTokenExp: number, refreshTokenExp: number, scope?: string);
}

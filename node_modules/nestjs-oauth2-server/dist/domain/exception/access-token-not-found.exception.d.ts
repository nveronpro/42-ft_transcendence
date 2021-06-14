import { NotFoundException, UnauthorizedException } from "@nestjs/common";
/**
 * Exception thrown when an access token was not found
 */
export declare class AccessTokenNotFoundException extends NotFoundException {
    /**
     * Kind message with id
     *
     * @param id
     */
    static withId(id: string): AccessTokenNotFoundException;
    /**
     * Kind message with accessToken
     *
     * @param accessToken
     */
    static withAccessToken(accessToken: string): UnauthorizedException;
    /**
     * Kind message with refreshToken
     *
     * @param refreshToken
     */
    static withRefreshToken(refreshToken: string): UnauthorizedException;
}

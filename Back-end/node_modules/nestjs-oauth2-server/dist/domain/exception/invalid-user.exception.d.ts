import { UnauthorizedException } from "@nestjs/common";
/**
 * Exception thrown when a user is invalid
 */
export declare class InvalidUserException extends UnauthorizedException {
    /**
     * Kind message with username and password
     *
     * @param username
     * @param password
     */
    static withUsernameAndPassword(username: string, password: string): InvalidUserException;
    /**
     * Kind message with id
     *
     * @param userId
     */
    static withId(userId: string): InvalidUserException;
}

import { InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
/**
 * Exception thrown when a client was not found
 */
export declare class ClientNotFoundException extends NotFoundException {
    /**
     * Kind message with id
     *
     * @param id
     */
    static withId(id: string): ClientNotFoundException;
    /**
     * Kind message with client ID
     *
     * @param clientId
     */
    static withClientId(clientId: string): UnauthorizedException;
    /**
     * Kind message with client ID
     *
     * @param name
     */
    static withName(name: string): InternalServerErrorException;
}

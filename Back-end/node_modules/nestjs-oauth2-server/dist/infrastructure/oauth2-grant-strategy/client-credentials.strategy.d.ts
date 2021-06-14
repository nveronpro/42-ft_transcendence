import { Oauth2GrantStrategyInterface } from "../../domain/strategy";
import { OAuth2Request, OAuth2Response } from "../../ui/dto";
import { ClientEntity, ClientRepositoryInterface } from "../../domain";
import { CommandBus } from "@nestjs/cqrs";
export declare class ClientCredentialsStrategy implements Oauth2GrantStrategyInterface {
    private readonly clientRepository;
    private readonly commandBus;
    /**
     * Constructor
     *
     * @param clientRepository
     * @param commandBus
     */
    constructor(clientRepository: ClientRepositoryInterface, commandBus: CommandBus);
    validate(request: OAuth2Request, client: ClientEntity): Promise<boolean>;
    getOauth2Response(request: OAuth2Request, client: ClientEntity): Promise<OAuth2Response>;
}

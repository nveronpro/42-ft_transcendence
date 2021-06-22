import { Oauth2GrantStrategyInterface } from "../../domain/strategy";
import { OAuth2Request, OAuth2Response } from "../../ui/dto";
import { AccessTokenRepositoryInterface, ClientEntity, ClientRepositoryInterface } from "../../domain";
import { CommandBus } from "@nestjs/cqrs";
export declare class RefreshTokenStrategy implements Oauth2GrantStrategyInterface {
    private readonly clientRepository;
    private readonly accessTokenRepository;
    private readonly commandBus;
    /**
     * Constructor
     *
     * @param clientRepository
     * @param accessTokenRepository
     * @param commandBus
     */
    constructor(clientRepository: ClientRepositoryInterface, accessTokenRepository: AccessTokenRepositoryInterface, commandBus: CommandBus);
    validate(request: OAuth2Request, client: ClientEntity): Promise<boolean>;
    getOauth2Response(request: OAuth2Request, client: ClientEntity): Promise<OAuth2Response>;
}

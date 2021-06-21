import { Oauth2GrantStrategyInterface } from "../../domain/strategy";
import { OAuth2Request, OAuth2Response } from "../../ui/dto";
import { ClientEntity, ClientRepositoryInterface, UserValidatorInterface } from "../../domain";
import { CommandBus } from "@nestjs/cqrs";
export declare class PasswordStrategy implements Oauth2GrantStrategyInterface {
    private readonly clientRepository;
    private readonly userValidator;
    private readonly commandBus;
    /**
     * Constructor
     *
     * @param clientRepository
     * @param userValidator
     * @param commandBus
     */
    constructor(clientRepository: ClientRepositoryInterface, userValidator: UserValidatorInterface, commandBus: CommandBus);
    validate(request: OAuth2Request, client: ClientEntity): Promise<boolean>;
    getOauth2Response(request: OAuth2Request, client: ClientEntity): Promise<OAuth2Response>;
}

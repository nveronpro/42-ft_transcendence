import { EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccessTokenCommand } from "./create-access-token.command";
import { AccessTokenEntity, AccessTokenRepositoryInterface, ClientRepositoryInterface } from "../../domain";
export declare class CreateAccessTokenHandler implements ICommandHandler<CreateAccessTokenCommand> {
    private readonly accessTokenRepository;
    private readonly clientRepository;
    private readonly eventBus;
    constructor(accessTokenRepository: AccessTokenRepositoryInterface, clientRepository: ClientRepositoryInterface, eventBus: EventBus);
    /**
     * Execute the create AccessToken Command
     *
     * @param command
     */
    execute(command: CreateAccessTokenCommand): Promise<AccessTokenEntity>;
}

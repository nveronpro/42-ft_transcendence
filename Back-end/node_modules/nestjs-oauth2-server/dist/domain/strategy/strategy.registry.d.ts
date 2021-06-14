import { Oauth2GrantStrategyInterface } from "./oauth2-grant-strategy.interface";
import { OAuth2Request, OAuth2Response } from "../../ui/dto";
import { Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ClientEntity } from "../client.entity";
export declare type Oauth2GrantStrategyType = Type<Oauth2GrantStrategyInterface>;
/**
 * This is the main class used to execute strategies
 */
export declare class Oauth2GrantStrategyRegistry {
    private readonly moduleRef;
    /**
     * Store all available granted strategy
     */
    private registry;
    constructor(moduleRef: ModuleRef);
    /**
     * Register a single strategy
     *
     * @param strategy
     */
    protected registerStrategy(strategy: Oauth2GrantStrategyType): void;
    /**
     * Register all strategies with the decorator
     *
     * @param strategies
     */
    register(strategies?: Oauth2GrantStrategyType[]): void;
    /**
     * Validate the client associated to the given request
     *
     * @param request
     * @param client
     */
    validate(request: OAuth2Request, client: ClientEntity): Promise<boolean>;
    /**
     * Get the response
     *
     * @param request
     * @param client
     */
    getOauth2Response(request: OAuth2Request, client: ClientEntity): Promise<OAuth2Response>;
    private reflectStrategyName;
}

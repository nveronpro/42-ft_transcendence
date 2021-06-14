import { AccessTokenRepositoryInterface } from "../../domain/repository";
import { Oauth2PayloadInterface } from "../../domain/interface";
import { UserLoaderInterface } from "../../domain/interface/user-loader.interface";
declare const AccessTokenStrategy_base: new (...args: any[]) => any;
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    private readonly accessTokenRepository;
    private readonly userLoader;
    constructor(accessTokenRepository: AccessTokenRepositoryInterface, userLoader: UserLoaderInterface);
    /**
     * Validate the bearer (accessToken) using the HTTP Bearer Header strategy
     *
     * @param bearer
     */
    validate(bearer: string): Promise<Oauth2PayloadInterface>;
}
export {};

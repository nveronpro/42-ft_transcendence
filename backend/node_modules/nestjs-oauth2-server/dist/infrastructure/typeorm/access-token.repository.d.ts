import { AccessTokenRepositoryInterface, AccessTokenEntity } from "../../domain";
import { DeleteResult, Repository } from "typeorm";
export declare class AccessTokenRepository implements AccessTokenRepositoryInterface {
    private readonly repository;
    constructor(repository: Repository<AccessTokenEntity>);
    findByAccessToken(accessToken: string): Promise<AccessTokenEntity>;
    findByRefreshToken(refreshToken: string): Promise<AccessTokenEntity>;
    create(accessToken: AccessTokenEntity): Promise<AccessTokenEntity>;
    delete(accessToken: AccessTokenEntity): Promise<DeleteResult>;
    deleteById(id: string): Promise<DeleteResult>;
}

export declare class ClientEntity {
    id: string;
    name: string;
    clientId: string;
    clientSecret: string;
    grants: string[];
    /**
     * Client scope. The scope should contain the list of third party applications
     * the client has access to
     */
    scope: string;
    accessTokenLifetime: number;
    refreshTokenLifetime: number;
    privateKey: string;
    publicKey: string;
    cert: string;
    certExpiresAt: Date;
    createdAt: Date;
    deletedAt: Date;
}

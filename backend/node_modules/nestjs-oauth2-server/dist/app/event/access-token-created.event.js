"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenCreatedEvent = void 0;
/**
 * Event generated when an access token is generated
 */
class AccessTokenCreatedEvent {
    constructor(id, clientId, accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, scope, userId) {
        this.id = id;
        this.clientId = clientId;
        this.accessToken = accessToken;
        this.accessTokenExpiresAt = accessTokenExpiresAt;
        this.refreshToken = refreshToken;
        this.refreshTokenExpiresAt = refreshTokenExpiresAt;
        this.scope = scope;
        this.userId = userId;
    }
}
exports.AccessTokenCreatedEvent = AccessTokenCreatedEvent;
//# sourceMappingURL=access-token-created.event.js.map
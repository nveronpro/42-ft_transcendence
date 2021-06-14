"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClientCommand = void 0;
/**
 * Command used to create clients
 */
class CreateClientCommand {
    constructor(name, scope, clientId, grants, noSecret, accessTokenLifetime, refreshTokenLifetime) {
        this.name = name;
        this.scope = scope;
        this.clientId = clientId;
        this.grants = grants;
        this.noSecret = noSecret;
        this.accessTokenLifetime = accessTokenLifetime;
        this.refreshTokenLifetime = refreshTokenLifetime;
    }
}
exports.CreateClientCommand = CreateClientCommand;
//# sourceMappingURL=create-client.command.js.map
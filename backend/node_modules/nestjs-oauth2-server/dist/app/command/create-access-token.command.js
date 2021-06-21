"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccessTokenCommand = void 0;
class CreateAccessTokenCommand {
    constructor(clientId, scope, exp, iat, request, userId) {
        this.clientId = clientId;
        this.scope = scope;
        this.exp = exp;
        this.iat = iat;
        this.request = request;
        this.userId = userId;
    }
}
exports.CreateAccessTokenCommand = CreateAccessTokenCommand;
//# sourceMappingURL=create-access-token.command.js.map
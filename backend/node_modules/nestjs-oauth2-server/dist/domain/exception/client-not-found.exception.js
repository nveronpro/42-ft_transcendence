"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientNotFoundException = void 0;
const common_1 = require("@nestjs/common");
/**
 * Exception thrown when a client was not found
 */
class ClientNotFoundException extends common_1.NotFoundException {
    /**
     * Kind message with id
     *
     * @param id
     */
    static withId(id) {
        return new ClientNotFoundException(`The client with id "${id}" was not found`);
    }
    /**
     * Kind message with client ID
     *
     * @param clientId
     */
    static withClientId(clientId) {
        return new common_1.UnauthorizedException(`The client with clientId "${clientId}" was not found`);
    }
    /**
     * Kind message with client ID
     *
     * @param name
     */
    static withName(name) {
        return new common_1.UnauthorizedException(`The client with name "${name}" was not found`);
    }
}
exports.ClientNotFoundException = ClientNotFoundException;
//# sourceMappingURL=client-not-found.exception.js.map
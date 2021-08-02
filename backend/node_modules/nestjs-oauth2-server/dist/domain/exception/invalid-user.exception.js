"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidUserException = void 0;
const common_1 = require("@nestjs/common");
/**
 * Exception thrown when a user is invalid
 */
class InvalidUserException extends common_1.UnauthorizedException {
    /**
     * Kind message with username and password
     *
     * @param username
     * @param password
     */
    static withUsernameAndPassword(username, password) {
        return new InvalidUserException(`The user with username "${username}" and password "${password}" was not found`);
    }
    /**
     * Kind message with id
     *
     * @param userId
     */
    static withId(userId) {
        return new InvalidUserException(`The user with id "${userId}" was not found`);
    }
}
exports.InvalidUserException = InvalidUserException;
//# sourceMappingURL=invalid-user.exception.js.map
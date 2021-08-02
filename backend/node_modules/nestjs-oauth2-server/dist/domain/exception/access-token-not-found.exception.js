"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenNotFoundException = void 0;
const common_1 = require("@nestjs/common");
/**
 * Exception thrown when an access token was not found
 */
class AccessTokenNotFoundException extends common_1.NotFoundException {
    /**
     * Kind message with id
     *
     * @param id
     */
    static withId(id) {
        return new AccessTokenNotFoundException(`The access toekn with id "${id}" was not found`);
    }
    /**
     * Kind message with accessToken
     *
     * @param accessToken
     */
    static withAccessToken(accessToken) {
        return new common_1.UnauthorizedException(`The access token with accessToken "${accessToken}" was not found`);
    }
    /**
     * Kind message with refreshToken
     *
     * @param refreshToken
     */
    static withRefreshToken(refreshToken) {
        return new common_1.UnauthorizedException(`The refresh token with refreshToken "${refreshToken}" was not found`);
    }
}
exports.AccessTokenNotFoundException = AccessTokenNotFoundException;
//# sourceMappingURL=access-token-not-found.exception.js.map
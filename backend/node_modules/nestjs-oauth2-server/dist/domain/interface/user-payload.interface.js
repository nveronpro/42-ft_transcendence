"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPayload = void 0;
const oauth2_payload_interface_1 = require("./oauth2-payload.interface");
/**
 * Represents a UserPayload
 */
class UserPayload {
    constructor(accessToken, id, username, email) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        /**
         * The current payload type should not be changed as it should always be user in this case
         */
        this.type = oauth2_payload_interface_1.Oauth2PayloadType.USER;
    }
}
exports.UserPayload = UserPayload;
//# sourceMappingURL=user-payload.interface.js.map
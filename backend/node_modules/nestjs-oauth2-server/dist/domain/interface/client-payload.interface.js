"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPayload = void 0;
const oauth2_payload_interface_1 = require("./oauth2-payload.interface");
/**
 * Represents a client's payload
 */
class ClientPayload {
    constructor(accessToken, id, clientId, name) {
        this.accessToken = accessToken;
        this.id = id;
        this.clientId = clientId;
        this.name = name;
        // Store the current type of payload user or client
        // When the client is connected he should only be able to access his own resources
        this.type = oauth2_payload_interface_1.Oauth2PayloadType.CLIENT;
    }
}
exports.ClientPayload = ClientPayload;
//# sourceMappingURL=client-payload.interface.js.map
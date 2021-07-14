"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCreatedEvent = void 0;
/**
 * Event published when a client is created
 */
class ClientCreatedEvent {
    constructor(id, name, clientId, certExpiresAt) {
        this.id = id;
        this.name = name;
        this.clientId = clientId;
        this.certExpiresAt = certExpiresAt;
    }
}
exports.ClientCreatedEvent = ClientCreatedEvent;
//# sourceMappingURL=client-created.event.js.map
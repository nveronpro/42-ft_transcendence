"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let EventsGateway = class EventsGateway {
    newCo(coords, client) {
        console.log(this.first);
        if (this.first == false) {
            coords.spect = false;
            coords.moving = this.moving;
            client.emit("is-spect", coords);
            return;
        }
        this.first = false;
        coords.spect = false;
        client.emit("is-spect", coords);
    }
    bePlayer(coords, client) {
        coords.spect = false;
        client.emit("is-spect", coords);
    }
    beSpect(coords, client) {
        coords.spect = true;
        client.emit("is-spect", coords);
    }
    barTop(coords) {
        coords.barY -= 15;
        this.server.emit("new-coords", coords);
    }
    barBottom(coords) {
        coords.barY += 15;
        this.server.emit("new-coords", coords);
    }
    move(coords) {
        this.moving = true;
        coords.moving = true;
        coords.posX += coords.vxBall;
        coords.posY += coords.vyBall;
        if (coords.posY <= coords.barY + 100 &&
            coords.posY >= coords.barY &&
            coords.posX <= 15 && coords.posX >= 0) {
            coords.vxBall = -coords.vxBall;
        }
        else if (coords.posX + coords.vxBall < 0) {
            this.moving = false;
            coords.moving = false;
            coords.posX = 300;
            coords.posY = 0;
            coords.barX = 0;
            coords.barY = 220;
            this.server.emit('new-coords', coords);
            return;
        }
        if (coords.moving) {
            if (coords.posY + coords.vyBall < 0) {
                coords.vyBall = -coords.vyBall;
            }
            if (coords.posY + coords.vyBall > coords.height) {
                coords.vyBall = -coords.vyBall;
            }
            if (coords.posX + coords.vxBall > coords.width) {
                coords.vxBall = -coords.vxBall;
            }
        }
        this.server.emit('new-coords', coords);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage('new-co'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "newCo", null);
__decorate([
    websockets_1.SubscribeMessage('be-player'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "bePlayer", null);
__decorate([
    websockets_1.SubscribeMessage('be-spect'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "beSpect", null);
__decorate([
    websockets_1.SubscribeMessage('bar-top'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "barTop", null);
__decorate([
    websockets_1.SubscribeMessage('bar-bottom'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "barBottom", null);
__decorate([
    websockets_1.SubscribeMessage('move'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "move", null);
EventsGateway = __decorate([
    websockets_1.WebSocketGateway()
], EventsGateway);
exports.EventsGateway = EventsGateway;
//# sourceMappingURL=events.gateway.js.map
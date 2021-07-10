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
    handleConnection(client) {
        if (this.players == undefined) {
            this.players = 1;
            client.emit("role", {
                role: 1,
                room: Math.round(this.players / 2).toString()
            });
            client.join(Math.round(this.players / 2).toString());
        }
        else {
            this.players++;
            if (this.players % 2 == 0) {
                client.emit("role", {
                    role: 2,
                    room: Math.round(this.players / 2).toString()
                });
                client.join(Math.round(this.players / 2).toString());
            }
            else {
                client.emit("role", {
                    role: 1,
                    room: Math.round(this.players / 2).toString()
                });
                client.join(Math.round(this.players / 2).toString());
            }
        }
        this.rooms = Math.round(this.players / 2);
        console.log('Players : ' + this.players);
        console.log('Rooms : ' + this.rooms);
    }
    bar1Top(coords) {
        coords.bar1Y -= 15;
        this.server.to(coords.room).emit("new-coords", coords);
    }
    bar1Bottom(coords) {
        coords.bar1Y += 15;
        this.server.to(coords.room).emit("new-coords", coords);
    }
    bar2Top(coords) {
        coords.bar2Y -= 15;
        this.server.to(coords.room).emit("new-coords", coords);
    }
    bar2Bottom(coords) {
        coords.bar2Y += 15;
        this.server.to(coords.room).emit("new-coords", coords);
    }
    move(coords) {
        this.moving = true;
        coords.moving = true;
        coords.posX += coords.vxBall;
        coords.posY += coords.vyBall;
        if (coords.posY <= coords.bar1Y + 100 &&
            coords.posY >= coords.bar1Y &&
            coords.posX <= 15 && coords.posX >= 0) {
            coords.vxBall = -coords.vxBall;
        }
        else if (coords.posX + coords.vxBall < 0) {
            this.moving = false;
            coords.moving = false;
            coords.posX = 300;
            coords.posY = 0;
            coords.bar1X = 0;
            coords.bar1Y = 220;
            coords.bar2X = 685;
            coords.bar2Y = 220;
            coords.score2++;
            console.log('score ' + coords.score1 + ' : ' + coords.score2);
            this.server.to(coords.room).emit('new-coords', coords);
            return;
        }
        if (coords.posY <= coords.bar2Y + 100 &&
            coords.posY >= coords.bar2Y &&
            coords.posX >= 685 && coords.posX <= 700) {
            coords.vxBall = -coords.vxBall;
        }
        else if (coords.posX + coords.vxBall > 700) {
            this.moving = false;
            coords.moving = false;
            coords.posX = 300;
            coords.posY = 0;
            coords.bar1X = 0;
            coords.bar1Y = 220;
            coords.bar2X = 685;
            coords.bar2Y = 220;
            coords.score1++;
            console.log('score ' + coords.score1 + ' : ' + coords.score2);
            this.server.to(coords.room).emit('new-coords', coords);
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
        this.server.to(coords.room).emit('new-coords', coords);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage('bar1-top'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "bar1Top", null);
__decorate([
    websockets_1.SubscribeMessage('bar1-bottom'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "bar1Bottom", null);
__decorate([
    websockets_1.SubscribeMessage('bar2-top'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "bar2Top", null);
__decorate([
    websockets_1.SubscribeMessage('bar2-bottom'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "bar2Bottom", null);
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
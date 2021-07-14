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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEntity = void 0;
const typeorm_1 = require("typeorm");
let ClientEntity = class ClientEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ClientEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], ClientEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: 'client_id', type: 'text', nullable: false }),
    __metadata("design:type", String)
], ClientEntity.prototype, "clientId", void 0);
__decorate([
    typeorm_1.Column({ name: 'client_secret', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ClientEntity.prototype, "clientSecret", void 0);
__decorate([
    typeorm_1.Column({
        name: 'grants',
        type: 'simple-array',
        nullable: false,
        default: 'client_credentials,refresh_token'
    }),
    __metadata("design:type", Array)
], ClientEntity.prototype, "grants", void 0);
__decorate([
    typeorm_1.Column({ length: 500, nullable: false }),
    __metadata("design:type", String)
], ClientEntity.prototype, "scope", void 0);
__decorate([
    typeorm_1.Column({ name: 'access_token_lifetime', nullable: false, default: 3600 }),
    __metadata("design:type", Number)
], ClientEntity.prototype, "accessTokenLifetime", void 0);
__decorate([
    typeorm_1.Column({ name: 'refresh_token_lifetime', nullable: false, default: 7200 }),
    __metadata("design:type", Number)
], ClientEntity.prototype, "refreshTokenLifetime", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], ClientEntity.prototype, "privateKey", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], ClientEntity.prototype, "publicKey", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], ClientEntity.prototype, "cert", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', name: 'cert_expires_at', nullable: false }),
    __metadata("design:type", Date)
], ClientEntity.prototype, "certExpiresAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', name: 'created_at', nullable: false, default: () => 'now()' }),
    __metadata("design:type", Date)
], ClientEntity.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', name: 'deleted_at', nullable: true }),
    __metadata("design:type", Date)
], ClientEntity.prototype, "deletedAt", void 0);
ClientEntity = __decorate([
    typeorm_1.Entity('gb_oauth_client'),
    typeorm_1.Unique(['clientId'])
], ClientEntity);
exports.ClientEntity = ClientEntity;
//# sourceMappingURL=client.entity.js.map
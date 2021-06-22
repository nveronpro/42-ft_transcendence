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
exports.AccessTokenEntity = void 0;
const typeorm_1 = require("typeorm");
const client_entity_1 = require("./client.entity");
const ui_1 = require("../ui");
let AccessTokenEntity = class AccessTokenEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'access_token',
        primary: true,
        nullable: false,
        length: 80
    }),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "accessToken", void 0);
__decorate([
    typeorm_1.Column({
        name: 'refresh_token',
        unique: true,
        nullable: false,
        length: 80
    }),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "refreshToken", void 0);
__decorate([
    typeorm_1.Column('timestamp', { name: 'access_token_expires_at', nullable: false }),
    __metadata("design:type", Date)
], AccessTokenEntity.prototype, "accessTokenExpiresAt", void 0);
__decorate([
    typeorm_1.Column('timestamp', { name: 'refresh_token_expires_at', nullable: false }),
    __metadata("design:type", Date)
], AccessTokenEntity.prototype, "refreshTokenExpiresAt", void 0);
__decorate([
    typeorm_1.ManyToOne(type => client_entity_1.ClientEntity, { nullable: false }),
    typeorm_1.JoinColumn({ name: 'client_id', referencedColumnName: 'id' }),
    __metadata("design:type", client_entity_1.ClientEntity)
], AccessTokenEntity.prototype, "client", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "scope", void 0);
__decorate([
    typeorm_1.Column('timestamp', { name: 'created_on', nullable: false, default: () => 'now()' }),
    __metadata("design:type", Date)
], AccessTokenEntity.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ name: 'created_from', type: 'jsonb', nullable: true }),
    __metadata("design:type", ui_1.OAuth2Request)
], AccessTokenEntity.prototype, "createdFrom", void 0);
AccessTokenEntity = __decorate([
    typeorm_1.Entity('gb_oauth_access_token')
], AccessTokenEntity);
exports.AccessTokenEntity = AccessTokenEntity;
//# sourceMappingURL=access-token.entity.js.map
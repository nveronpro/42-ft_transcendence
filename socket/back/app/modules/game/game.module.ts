import { Module } from '@nestjs/common';
import { GameGateway } from './gateways/game/game.gateway';

@Module({
    components: [
        GameGateway
    ]
})
export class GameModule { }
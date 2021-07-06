import { Module } from '@nestjs/common';
import { GameModule } from './modules/game/game.module';

@Module({
    modules: [
        GameModule
    ]
})
export class ApplicationModule { }
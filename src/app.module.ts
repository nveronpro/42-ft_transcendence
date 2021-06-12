import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { MatchHistoriesModule } from './match-histories/match-histories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    MatchHistoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
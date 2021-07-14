import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { MatchHistoriesModule } from './match-histories/match-histories.module';
import { AuthModule } from './auth/auth.module';
import { Connection } from 'typeorm';
import { FriendsModule } from './friends/friends.module';
import { ProfileModule } from './profile/profile.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    MatchHistoriesModule,
    AuthModule,
    FriendsModule,
    ProfileModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
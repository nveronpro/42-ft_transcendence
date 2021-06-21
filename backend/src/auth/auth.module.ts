import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
@Module({
  imports: [
    PassportModule.register({
    defaultStrategy: 'jwt'
  }),
  JwtModule.register({
      secret: 'password',
      signOptions: {
        expiresIn: 3600
      }
    })],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

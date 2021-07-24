import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  ) {
    super({
        jwtFromRequest:ExtractJwt.fromExtractors([(request: Request) => {
          let data = null;
          if (request?.cookies){
            data = request?.cookies['auth-cookie']; //request wih axios
          }
          else {
            data = request['handshake'].headers['cookie'].split('=')[1]; // request with io
          }
          return data
        }]),
      ignoreExpiration: false,
      secretOrKey: 'password',
    });
  }

  async validate(payload: any) {
    const user = await User.findOne({login: payload.login});
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
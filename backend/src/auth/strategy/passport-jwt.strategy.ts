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
            // console.log("request:");
            // console.log(request);
            // console.log("request.cookies:");
            // console.log(request.cookies);
            let data = request?.cookies['auth-cookie'];
            if(!data){
                return null;
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
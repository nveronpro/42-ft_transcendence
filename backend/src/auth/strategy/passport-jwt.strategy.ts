import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  ) {
    super({
        jwtFromRequest:ExtractJwt.fromExtractors([(request:Request) => {
            let data = request?.cookies["auth-cookie"];
            console.log(data);
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
    console.log(payload);
    const user = await User.findOne({login: payload.login});
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
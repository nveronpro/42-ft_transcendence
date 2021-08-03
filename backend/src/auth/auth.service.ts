import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as ClientOAuth2 from 'client-oauth2';
import * as needle from 'needle';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import {Response, Request} from 'express';

import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import {avatars_64} from '../ressources/avatar_default';

const intra42auth = new ClientOAuth2({
	clientId: process.env.API_ID,
	clientSecret: process.env.API_SECRET,
	accessTokenUri: 'https://api.intra.42.fr/oauth/token',
	authorizationUri: 'https://api.intra.42.fr/oauth/authorize',
	redirectUri: `http://localhost:8080/auth/callback`,
	scopes: ['public']
})

@Injectable()
export class AuthService {
	constructor( private jwtService: JwtService ){}
	create(createAuthDto: CreateAuthDto) {
		return 'This action adds a new auth';
	}

	findAll() {
		return `This action returns all auth`;
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`;
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
	return `This action updates a #${id} auth`;
	}

	remove(id: number) {
		return `This action removes a #${id} auth`;
	}

  login() {
    const url = intra42auth.code.getUri()
    return url;
  }

  google_auth(code: string, user: User) {
    return speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'ascii',
      token: code,
      window: 2
    });
  }

  public async callback(code: string, res: Response) {
    let url = `http://localhost:8080/auth/callback?code=${code}`
    try {
      let user_connected = await intra42auth.code.getToken(url);
      let response = await user_connected.sign({
        method: 'get',
        url: 'https://api.intra.42.fr/v2/me',
        headers: {}
      })
      const req = await needle('get', response.url, {}, { headers: response.headers });
      let user = await User.findOne({ login: req.body.login});
      if (!user){
        const usrDto1 = new CreateUserDto();
				usrDto1.login = req.body.login;
				usrDto1.nickname = "Nick_" + req.body.login;

				//checking if nickname already exists
				if (await User.findOne({ nickname: usrDto1.nickname }) != undefined) {
          let i: number = 1;
          usrDto1.nickname += "_";
          while (await User.findOne({ nickname: usrDto1.nickname + i }) != undefined)
          {
            i++;
          }
          usrDto1.nickname = usrDto1.nickname + i;
				}
					
				usrDto1.wins = 0;
        usrDto1.looses = 0;
        usrDto1.two_factor_auth = false;
				usrDto1.current_status = "none";
				usrDto1.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

        var secret = speakeasy.generateSecret({
          name: usrDto1.login
        });
        usrDto1.secret = secret.ascii;
        usrDto1.qrcode_data = await qrcode.toDataURL(secret.otpauth_url);
        await User.create(usrDto1).save();
      }
      const payload = {
        login: req.body.login,
      };
      const jwt = await this.jwtService.sign(payload);
      return {
        "access_token" : jwt
      };
		} catch (error) {
			console.log("Error: " + error);
			res.redirect("/");
		}
	}
}
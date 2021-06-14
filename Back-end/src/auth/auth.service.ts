import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as ClientOAuth2 from 'client-oauth2';
import * as needle from 'needle';
import { use } from 'passport';

const intra42auth = new ClientOAuth2({
  clientId: process.env.API_ID,
	clientSecret: process.env.API_SECRET,
	accessTokenUri: 'https://api.intra.42.fr/oauth/token',
	authorizationUri: 'https://api.intra.42.fr/oauth/authorize',
	redirectUri: `http://localhost:3000/auth/callback`,
	scopes: ['public']
})

@Injectable()
export class AuthService {
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

  public async login() {
		const url = intra42auth.code.getUri()
    console.log(url);
  }
  
  public async callback(code: string) {
    let url = `http://localhost:3000/auth/callback?code=${code}`
    try {
      let user = await intra42auth.code.getToken(url);
      let response = await user.sign({
        method: 'get',
        url: 'https://api.intra.42.fr/v2/me',
        headers: {}
      })
      const req = await needle('get', response.url, {}, { headers: response.headers });
      console.log(req.body.login);
		} catch (error) {
      console.log("Error: " + error);
		}
	}
}
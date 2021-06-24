import { Controller, Post, Get, Query, Redirect, UseGuards, Req, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import {Response, Request} from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Get('/login')
  //@Redirect('/', 302) // TODO CHANGE THE CODE
  login(/*@Res() res: Response*/){
	this.logger.log("@GET(/login)");
    const url_login = this.authService.login();
	this.logger.log("url:"+url_login);
    return {url: url_login};
  }

  @Get('/logout')
  @Redirect('/', 302) // TODO CHANGE THE CODE
  logout(@Res() res: Response){
    res.clearCookie('auth-cookie', { httpOnly: true });
  }


  @Get('/callback')
  @Redirect('/', 302) // TODO CHANGE THE CODE
  async callback(@Query('code') code, @Res() res: Response){
    const token = await this.authService.callback(code, res);
    return { url: "/auth/saveToken?token=" + token.access_token };
  }

  @Get('/saveToken')
  @Redirect('/', 302) // TODO CHANGE THE CODE
  saveToken(@Query('token') token, @Res() res: Response){
    res.cookie('auth-cookie', token, { httpOnly: true });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async profile(@User() user){
    console.log(user);
  }
}
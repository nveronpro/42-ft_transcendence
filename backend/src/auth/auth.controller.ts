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
  @Redirect('/', 302) // CHANGE THE CODE
  login(@Res() res: Response){
    const url_login = this.authService.login();
    return {url: url_login};
  }

  @Get('/logout')
  @Redirect('http://localhost:3000', 302) // CHANGE THE CODE
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
  @Redirect('http://localhost:3000', 302) // CHANGE THE CODE
  saveToken(@Query('token') token, @Res() res: Response){
    res.cookie('auth-cookie', token, { httpOnly: true });
  }

  @Post('/google_auth')
  @UseGuards(JwtAuthGuard)
  google_auth(@Query('code') code, @User() user){
    return this.authService.google_auth(code, user);
  }

  @Get('/cookie')
  cookie(@Req() request: Request){
    if (request.cookies["auth-cookie"])
      return true;
    else
      return false;
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async profile(@User() user){
    return user;
  }
}
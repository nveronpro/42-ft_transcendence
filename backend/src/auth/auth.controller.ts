import { Controller, Post, Get, Query, Redirect, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/ user.decorator';
import {Response, Request} from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @Redirect('/', 302) // CHANGE THE CODE
  login(@Res() res: Response){
    console.log("test login");
    const url_login = this.authService.login();
    return { url: url_login };

  }

  @Get('/logout')
  @Redirect('/', 302) // CHANGE THE CODE
  logout(@Res() res: Response){
    res.clearCookie('auth-cookie', { httpOnly: true });
  }


  @Get('/callback')
  @Redirect('/', 302) // CHANGE THE CODE
  async callback(@Query('code') code, @Res() res: Response){
    const token = await this.authService.callback(code, res);
    return { url: "/auth/saveToken?token=" + token.access_token };
  }

  @Get('/saveToken')
  @Redirect('http://localhost:8080', 302) // CHANGE THE CODE
  saveToken(@Query('token') token, @Res() res: Response){
    res.cookie('auth-cookie', token, { httpOnly: true });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async profile(@User() user){
    console.log(user);
  }
}
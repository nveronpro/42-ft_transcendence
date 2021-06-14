import { Controller, Res, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  login(){
    return this.authService.login();
  }

  @Get('/callback')
  callback(@Query('code') code){
    console.log("code: " + code);
    return this.authService.callback(code);
  }
}

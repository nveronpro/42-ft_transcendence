import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import {Response, Request} from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //@UseGuards(JwtAuthGuard)
  home(@Req() request: Request){
    let data = request.cookies["auth-cookie"];
    if (data) {
      console.log("Classique page");
    } else {
      console.log("You need to connect to your 42 account");
    }
  }
}

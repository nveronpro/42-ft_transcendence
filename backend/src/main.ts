import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seed } from './seed/seed';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //seed();
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();

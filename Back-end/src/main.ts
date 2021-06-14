import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seed } from './seed/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //seed();
  await app.listen(3000);
}
bootstrap();

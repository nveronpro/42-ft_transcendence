import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Seed } from './seed/seed';

async function bootstrap() {
  const seed = new Seed();
  const app = await NestFactory.create(AppModule);
  seed.seeding();
  await app.listen(3000);
}
bootstrap();

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seed } from './seed/seed';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: [
			'error',
			'warn',
			'log',
			'debug',
			'verbose'
		],
		cors: {
			origin: 'http://localhost:3000',
			credentials: true,
		  },
	});
	app.enableCors({
        "origin": "http://localhost:3000",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        "preflightContinue": false,
        "optionsSuccessStatus": 204,
        credentials: true,
    });
	seed();
	app.use(cookieParser());
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
	  await app.listen(8080);
}
bootstrap();

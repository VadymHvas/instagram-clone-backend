import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>("NODE_ENV") === "development" ? "*" : "",
    credentials: true,
    methods: ["GET", "POST"],
  });

  app.use(cookieParser());

  await app.listen(configService.get<number>("PORT"));
}
bootstrap();

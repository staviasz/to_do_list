import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ENV_SERVER } from './config/env';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(ENV_SERVER.port);
}
void bootstrap();

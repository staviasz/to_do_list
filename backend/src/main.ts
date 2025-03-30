import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ENV_SERVER } from './config/env';
import { AppModule } from './modules/app.module';
import { PrismaExceptions } from './modules/prisma/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new PrismaExceptions());
  await app.listen(ENV_SERVER.port);
}
void bootstrap();

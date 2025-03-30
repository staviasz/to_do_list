import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptions implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2025': {
        const modelName = exception.meta?.modelName as string;
        response.status(404).json({
          statusCode: 404,
          message: `${modelName} não encontrado`,
        });
        break;
      }
      case 'P2023':
        response.status(400).json({
          statusCode: 400,
          message: 'Id inválido',
        });
        break;
      case 'P2002': {
        const targetSplit: string = exception.meta?.target as string;
        response.status(409).json({
          statusCode: 409,
          message: `${targetSplit} já existe`,
        });
        break;
      }
      default: {
        const message = exception.meta?.cause ?? exception.message;
        response.status(500).json({
          statusCode: 500,
          message,
        });
      }
    }
  }
}

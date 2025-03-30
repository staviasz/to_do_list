import {
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptions implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P2025': {
        const modelName = exception.meta?.modelName as string;
        throw new NotFoundException(`${modelName} não encontrado(a)`);
      }
      case 'P2023':
        throw new BadRequestException('Id inválido');
      case 'P2002': {
        const targetSplit: string = exception.meta?.target as string;
        throw new ConflictException(`${targetSplit} ja existe`);
      }
      default: {
        const message = exception.meta?.cause ?? exception.message;
        throw new InternalServerErrorException(message);
      }
    }
  }
}

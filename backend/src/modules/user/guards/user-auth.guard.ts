import { JWTAdapter } from '@/modules/auth/infra/jwt.adapter';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JWTAdapter,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    try {
      const { userId } = this.jwt.decode(token) as JwtPayload;

      if (!userId) {
        throw new UnauthorizedException('Token inválido');
      }

      request.user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId as number,
        },
        select: {
          id: true,
        },
      });

      return true;
    } catch (error) {
      throw new UnauthorizedException((error as Error).message);
    }
  }
}

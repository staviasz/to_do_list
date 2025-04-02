import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JWTAdapter } from './infra/jwt.adapter';

type CreateSessionProps = Record<string, any> & {
  userId: number;
};

type RefreshSessionProps = Record<string, any> & {
  token: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly dbClient: PrismaService,
    private readonly jwtService: JWTAdapter,
  ) {}

  async createSession(payload: CreateSessionProps) {
    const token = this.jwtService.sign({ payload, expiresIn: '1M' });
    const refreshToken = this.jwtService.sign({ payload, expiresIn: '1D' });

    await this.dbClient.session.create({
      data: {
        token,
        refresh_token: refreshToken,
        user_id: payload.userId,
      },
    });

    return { token, refreshToken, expiresInMs: 30 * 60 * 1000 };
  }

  async refreshSession(props: RefreshSessionProps) {
    const { token, refreshToken, ...payload } = props;

    const decodeToken = this.jwtService.decode(token);
    if (decodeToken) {
      return {
        token,
        refreshToken,
      };
    }

    const decodeRefreshToken = this.jwtService.decode(refreshToken);
    if (!decodeRefreshToken) {
      throw new UnauthorizedException('Sessão Expirada');
    }

    const session = await this.dbClient.session.findUniqueOrThrow({
      where: {
        uniqueTokenRefreshToken: {
          token,
          refresh_token: refreshToken,
        },
      },
    });

    return await this.createSession({
      ...payload,
      userId: session.user_id,
    });
  }
}

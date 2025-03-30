import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, LoginDto, RefreshSessionDto } from './dto/';
import { HashAdapter } from './infra/hash.adapter';

@Injectable()
export class UserService {
  constructor(
    private readonly dbClient: PrismaService,
    private readonly hashService: HashAdapter,
    private readonly authService: AuthService,
  ) {}

  async create(input: CreateUserDto) {
    const { name, email, password } = input;

    const hashPassword = await this.hashService.hash(password);

    const user = await this.dbClient.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(input: LoginDto) {
    const { email, password } = input;

    const user = await this.dbClient.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return await this.authService.createSession({
      userId: user.id,
    });
  }

  async refreshSession(props: RefreshSessionDto) {
    return await this.authService.refreshSession(props);
  }
}

/*
 * @jest-environment ./config/jest.environment.ts
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { JWTAdapter } from '../auth/infra/jwt.adapter';
import { PrismaExceptions } from '../prisma/prisma-exception.filter';
import { PrismaService } from '../prisma/prisma.service';
import { HashAdapter } from './infra/hash.adapter';

describe('UserController (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let hashAdapter: HashAdapter;
  let jwtService: JWTAdapter;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new PrismaExceptions());

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    hashAdapter = app.get<HashAdapter>(HashAdapter);
    jwtService = app.get<JWTAdapter>(JWTAdapter);

    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/user (POST)', () => {
    it('should return 201 Created and the created user data', async () => {
      const createUserDto = {
        name: 'EE Test User',
        email: 'e2e@example.com',
        password: 'E2ePassword123',
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toEqual(createUserDto.name);
      expect(response.body.email).toEqual(createUserDto.email);

      const userInDb = await prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      expect(userInDb).toBeDefined();
      expect(userInDb?.name).toEqual(createUserDto.name);
      expect(userInDb?.email).toEqual(createUserDto.email);
    });

    it('should return 400 Bad Request if name is invalid', async () => {
      const arrange = [
        {
          name: '',
          message: [
            'O nome deve ser preenchido.',
            'O nome deve conter apenas letras, espaços e hífen.',
            'O nome deve ter pelo menos 3 caracteres.',
          ],
        },
        {
          name: '    ',
          message: ['O nome deve ser preenchido.'],
        },
        {
          name: 'A',
          message: ['O nome deve ter pelo menos 3 caracteres.'],
        },
        {
          name: 'A'.repeat(256),
          message: ['O nome deve ter no máximo 255 caracteres.'],
        },
      ];

      for (const item of arrange) {
        const response = await request(app.getHttpServer())
          .post('/user')
          .send({
            email: 'invalid-short-name@example.com',
            password: 'ValidPassword123',
            name: item.name,
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toBeDefined();
        expect(Array.isArray(response.body.message)).toBe(true);
        expect(response.body).toEqual({
          message: item.message,
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    });

    it('should return 400 Bad Request if email is invalid', async () => {
      const arrange = [
        'usuario',
        'usuario@',
        '@dominio.com',
        'usuario@dominio',
        'usuario.dominio',
        'usuario@@dominio.com',
        ' usuario@dominio.com',
        'usuario @dominio.com',
        'usuario.@dominio.com',
        '.usuario@dominio.com',
        'usuario..sobrenome@dominio.com',
        'usuario@.com',
        'usuario@dominio.',
        'usuario@dominio..com',
        'usuario@dominio_.com',
        'usuario@dominio-',
        'usuario@-dominio.com',
        'usuario@dominio com espaço.com',
        'usuario@dominio.c',
        'usuario@dominio.123',
      ];

      for (const email of arrange) {
        const response = await request(app.getHttpServer())
          .post('/user')
          .send({
            email,
            password: 'ValidPassword123',
            name: 'name',
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toBeDefined();
        expect(Array.isArray(response.body.message)).toBe(true);
        expect(response.body).toEqual({
          message: ['O email deve ser um email válido.'],
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    });

    it('should return 400 Bad Request if password is invalid', async () => {
      const arrange = [
        { password: 'senha123' },
        { password: 'Senha123!' },
        { password: 'senha com espaço' },
        { password: 'senha-com-hífen' },
        { password: 'senha_sublinhado' },
        { password: 'senha.' },
        { password: 'senha},' },
        { password: 'senha$' },
        { password: 'senha%' },
        { password: 'senha&' },
        { password: 'senha*' },
        { password: 'senha(' },
        { password: 'senha)' },
        { password: 'senha=' },
        { password: 'senha+' },
        { password: 'senha[' },
        { password: 'senha]' },
        { password: 'senha{' },
        { password: 'senha}' },
        { password: 'senha\\' },
        { password: 'senha|' },
        { password: 'senha:' },
        { password: 'senha;' },
        { password: "senha'" },
        { password: 'senha"' },
        { password: 'senha<' },
        { password: 'senha>' },
        { password: 'senha?' },
        { password: 'senha/' },
        {
          password: '\t',
          message: [
            'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
            'A senha deve ter pelo menos 6 caracteres.',
          ],
        },
        {
          password: '\n',
          message: [
            'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
            'A senha deve ter pelo menos 6 caracteres.',
          ],
        },
        {
          password: '',
          message: [
            'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
            'A senha deve ter pelo menos 6 caracteres.',
          ],
        },
        {
          password: ' ',
          message: [
            'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
            'A senha deve ter pelo menos 6 caracteres.',
          ],
        },
        {
          password: 'Test123'.repeat(50),
          message: ['A senha deve ter no máximo 100 caracteres.'],
        },
      ];

      for (const item of arrange) {
        const response = await request(app.getHttpServer())
          .post('/user')
          .send({
            email: 'example@example.com',
            password: item.password,
            name: 'name',
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toBeDefined();
        expect(Array.isArray(response.body.message)).toBe(true);
        expect(response.body).toEqual({
          message: item.message || [
            'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
          ],
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    });

    it('should handle database errors (e.g., email already exists)', async () => {
      const createUserDto = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'StrongPassword123',
      };

      await prisma.user.create({
        data: {
          ...createUserDto,
          password: await hashAdapter.hash(createUserDto.password),
        },
      });

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(HttpStatus.CONFLICT);

      expect(response.body).toEqual({
        message: 'email ja existe',
        error: 'Conflict',
        statusCode: 409,
      });
    });
  });

  describe('/user/login (POST)', () => {
    it('should return 201 Created and the created user data', async () => {
      const createUserDto = {
        email: 'example@example.com',
        password: 'E2ePassword123',
      };
      await prisma.user.create({
        data: {
          name: 'EE Test User',
          email: createUserDto.email,
          password: await hashAdapter.hash(createUserDto.password),
        },
      });

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send(createUserDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('expiresInMs');
    });
    it('should return 400 Bad Request if email is invalid', async () => {
      const arrange = [
        'usuario',
        'usuario@',
        '@dominio.com',
        'usuario@dominio',
        'usuario.dominio',
        'usuario@@dominio.com',
        ' usuario@dominio.com',
        'usuario @dominio.com',
        'usuario.@dominio.com',
        '.usuario@dominio.com',
        'usuario..sobrenome@dominio.com',
        'usuario@.com',
        'usuario@dominio.',
        'usuario@dominio..com',
        'usuario@dominio_.com',
        'usuario@dominio-',
        'usuario@-dominio.com',
        'usuario@dominio com espaço.com',
        'usuario@dominio.c',
        'usuario@dominio.123',
      ];

      for (const email of arrange) {
        const response = await request(app.getHttpServer())
          .post('/user/login')
          .send({
            email,
            password: 'ValidPassword123',
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toBeDefined();
        expect(Array.isArray(response.body.message)).toBe(true);
        expect(response.body).toEqual({
          message: ['O email deve ser um email válido.'],
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    });

    it('should return 400 Bad Request if password is invalid', async () => {
      const arrange = [
        { password: 'senha123' },
        { password: 'Senha123!' },
        { password: 'senha com espaço' },
        { password: 'senha-com-hífen' },
        { password: 'senha_sublinhado' },
        { password: 'senha.' },
        { password: 'senha},' },
        { password: 'senha$' },
        { password: 'senha%' },
        { password: 'senha&' },
        { password: 'senha*' },
        { password: 'senha(' },
        { password: 'senha)' },
        { password: 'senha=' },
        { password: 'senha+' },
        { password: 'senha[' },
        { password: 'senha]' },
        { password: 'senha{' },
        { password: 'senha}' },
        { password: 'senha\\' },
        { password: 'senha|' },
        { password: 'senha:' },
        { password: 'senha;' },
        { password: "senha'" },
        { password: 'senha"' },
        { password: 'senha<' },
        { password: 'senha>' },
        { password: 'senha?' },
        { password: 'senha/' },
        {
          password: '\t',
          message: [
            'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
            'A senha deve ter pelo menos 6 caracteres.',
          ],
        },
        {
          password: '\n',
          message: [
            'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
            'A senha deve ter pelo menos 6 caracteres.',
          ],
        },
        {
          password: '',
          message: [
            'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
            'A senha deve ter pelo menos 6 caracteres.',
          ],
        },
        {
          password: ' ',
          message: [
            'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
            'A senha deve ter pelo menos 6 caracteres.',
          ],
        },
        {
          password: 'Test123'.repeat(50),
          message: ['A senha deve ter no máximo 100 caracteres.'],
        },
      ];

      for (const item of arrange) {
        const response = await request(app.getHttpServer())
          .post('/user/login')
          .send({
            email: 'example@example.com',
            password: item.password,
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toBeDefined();
        expect(Array.isArray(response.body.message)).toBe(true);
        expect(response.body).toEqual({
          message: item.message || [
            'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
          ],
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    });
    it('Should not found user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: 'example2@example.com',
          password: 'ValidPassword123',
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        message: 'user não encontrado(a)',
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('user/ refresh (POST)', () => {
    it('should return 400 if token or refresh token not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/refresh')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        message: [
          'O token deve ser uma string.',
          'O refresh token deve ser uma string.',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    it('should return same token and refresh if token not expired', async () => {
      const token = 'token';
      const refreshToken = 'refreshToken';

      const jwtServiceSpy = jest.spyOn(jwtService, 'decode');
      jwtServiceSpy.mockReturnValueOnce(() => ({ userId: 1 }));

      const response = await request(app.getHttpServer())
        .post('/user/refresh')
        .send({ token, refreshToken })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        token,
        refreshToken,
      });
    });

    it('should return unauthorized if token and refresh expired', async () => {
      const token = 'token';
      const refreshToken = 'refreshToken';

      const jwtServiceSpy = jest.spyOn(jwtService, 'decode');
      jwtServiceSpy.mockReturnValueOnce(null).mockReturnValueOnce(null);

      const response = await request(app.getHttpServer())
        .post('/user/refresh')
        .send({ token, refreshToken })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        error: 'Unauthorized',
        message: 'Sessão Expirada',
        statusCode: 401,
      });
    });

    it('Should return not found if session not found', async () => {
      const jwtServiceSpy = jest.spyOn(jwtService, 'decode');
      jwtServiceSpy
        .mockReturnValueOnce(null)
        .mockReturnValueOnce({ userId: 1 });
      const response = await request(app.getHttpServer())
        .post('/user/refresh')
        .send({ token: 'token', refreshToken: 'refreshToken' })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        message: 'session não encontrado(a)',
        error: 'Not Found',
        statusCode: 404,
      });
    });
    it('Should return new token and refresh token', async () => {
      const jwtServiceSpy = jest.spyOn(jwtService, 'decode');
      jwtServiceSpy
        .mockReturnValueOnce(null)
        .mockReturnValueOnce({ userId: 1 });

      const prismaSpyFind = jest.spyOn(prisma.session, 'findUniqueOrThrow');
      prismaSpyFind.mockResolvedValueOnce({
        user_id: 1,
        id: 1,
        refresh_token: 'refreshToken',
        token: 'token',
      });

      const prismaSpyCreate = jest.spyOn(prisma.session, 'create');
      prismaSpyCreate.mockResolvedValueOnce({
        user_id: 1,
        id: 1,
        refresh_token: 'refreshToken',
        token: 'token',
      });

      const response = await request(app.getHttpServer())
        .post('/user/refresh')
        .send({ token: 'token', refreshToken: 'refreshToken' })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        token: expect.any(String),
        refreshToken: expect.any(String),
        expiresInMs: 1800000,
      });
    });
  });
});

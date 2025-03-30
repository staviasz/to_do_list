/*
 * @jest-environment ./config/jest.environment.ts
 */
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaExceptions } from '../prisma/prisma-exception.filter';
import { PrismaService } from '../prisma/prisma.service';
import { HashAdapter } from '../user/infra/hash.adapter';

describe('TasksController (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let hashAdapter: HashAdapter;
  let token: string;
  let user: any;

  beforeAll(async () => {
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

    const createUserDto = {
      name: 'EE Test User',
      email: 'example@example.com',
      password: 'E2ePassword123',
    };

    user = await prisma.user.create({
      data: {
        ...createUserDto,
        password: await hashAdapter.hash(createUserDto.password),
      },
    });

    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send(createUserDto);

    token = response.body.token as string;
  });

  afterAll(async () => {
    await prisma.tasks.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/tasks (POST)', () => {
    it('should return 201 Created and the created task data', async () => {
      const createTaskDto = {
        description: 'This is a test task',
        dateOfCompletion: '2026-06-01',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(createTaskDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.description).toEqual(createTaskDto.description);
      expect(response.body.description).toEqual(createTaskDto.description);
    });

    it('Should return error if description is invalid', async () => {
      const arrange = [
        {
          description: '',
          message: [
            'A descrição deve ser preenchido.',
            'A descrição deve ter pelo menos 3 caracteres.',
          ],
        },
        {
          description: '    ',
          message: ['A descrição deve ser preenchido.'],
        },
        {
          description: 'A',
          message: ['A descrição deve ter pelo menos 3 caracteres.'],
        },
        {
          description: 'A'.repeat(256),
          message: ['A descrição deve ter no máximo 255 caracteres.'],
        },
      ];

      for (const item of arrange) {
        const response = await request(app.getHttpServer())
          .post('/tasks')
          .set('Authorization', `Bearer ${token}`)
          .send({
            description: item.description,
            dateOfCompletion: '2026-06-01',
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
    it('Should return error if dateOfCompletion is invalid', async () => {
      const arrange = [
        {
          dateOfCompletion: '',
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
            'A data de conclusão deve ser uma string no formato YYYY-MM-DD.',
          ],
        },
        {
          dateOfCompletion: '    ',
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
            'A data de conclusão deve ser uma string no formato YYYY-MM-DD.',
          ],
        },
        {
          dateOfCompletion: 'A',
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
            'A data de conclusão deve ser uma string no formato YYYY-MM-DD.',
          ],
        },
        {
          dateOfCompletion: 'A'.repeat(256),
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
            'A data de conclusão deve ser uma string no formato YYYY-MM-DD.',
          ],
        },

        {
          dateOfCompletion: '2026-02-31',
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
          ],
        },
        {
          dateOfCompletion: '2020-03-01',
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
          ],
        },
      ];

      for (const item of arrange) {
        const response = await request(app.getHttpServer())
          .post('/tasks')
          .set('Authorization', `Bearer ${token}`)
          .send({
            description: 'This is a test task',
            dateOfCompletion: item.dateOfCompletion,
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
  });

  describe('/tasks (GET)', () => {
    it('should return 200 OK and the tasks data', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should return 200 OK and the task data', async () => {
      const task = await prisma.tasks.create({
        data: {
          completed: false,
          description: 'This is a test task',
          dateOfCompletion: new Date(2026, 6, 1),
          user: {
            connect: {
              id: user.id as number,
            },
          },
        },
      });
      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(task.id);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should return 204 No Content', async () => {
      const task = await prisma.tasks.create({
        data: {
          completed: false,
          description: 'This is a test task',
          dateOfCompletion: new Date(2026, 6, 1),
          user: {
            connect: {
              id: user.id as number,
            },
          },
        },
      });
      const response = await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NO_CONTENT);

      expect(response.body).toEqual({});
    });
  });

  describe('/tasks/:id (PUT)', () => {
    it('should return 200 OK', async () => {
      const task = await prisma.tasks.create({
        data: {
          completed: false,
          description: 'This is a test task',
          dateOfCompletion: new Date(2026, 6, 1),
          user: {
            connect: {
              id: user.id as number,
            },
          },
        },
      });
      const response = await request(app.getHttpServer())
        .put(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          completed: true,
        })
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(task.id);
    });

    it('Should return error if description is invalid', async () => {
      const arrange = [
        {
          description: '    ',
          message: ['A descrição deve ser preenchido.'],
        },
        {
          description: 'A',
          message: ['A descrição deve ter pelo menos 3 caracteres.'],
        },
        {
          description: 'A'.repeat(256),
          message: ['A descrição deve ter no máximo 255 caracteres.'],
        },
      ];

      for (const item of arrange) {
        const response = await request(app.getHttpServer())
          .put(`/tasks/${1}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            description: item.description,
            dateOfCompletion: '2026-06-01',
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
    it('Should return error if dateOfCompletion is invalid', async () => {
      const arrange = [
        {
          dateOfCompletion: '',
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
            'A data de conclusão deve ser uma string no formato YYYY-MM-DD.',
          ],
        },
        {
          dateOfCompletion: '    ',
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
            'A data de conclusão deve ser uma string no formato YYYY-MM-DD.',
          ],
        },
        {
          dateOfCompletion: 'A',
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
            'A data de conclusão deve ser uma string no formato YYYY-MM-DD.',
          ],
        },
        {
          dateOfCompletion: 'A'.repeat(256),
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
            'A data de conclusão deve ser uma string no formato YYYY-MM-DD.',
          ],
        },

        {
          dateOfCompletion: '2026-02-31',
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
          ],
        },
        {
          dateOfCompletion: '2020-03-01',
          message: [
            'dateOfCompletion deve ser uma data válida e futura no formato YYYY-MM-DD.',
          ],
        },
      ];

      for (const item of arrange) {
        const response = await request(app.getHttpServer())
          .put('/tasks/1')
          .set('Authorization', `Bearer ${token}`)
          .send({
            description: 'This is a test task',
            dateOfCompletion: item.dateOfCompletion,
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
    it('should return error if completed is invalid', async () => {
      const arrange = ['test', 12, 'true'];

      for (const item of arrange) {
        const response = await request(app.getHttpServer())
          .put('/tasks/1')
          .set('Authorization', `Bearer ${token}`)
          .send({
            description: 'This is a test task',
            dateOfCompletion: '2026-06-01',
            completed: item,
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toBeDefined();
        expect(Array.isArray(response.body.message)).toBe(true);
        expect(response.body).toEqual({
          message: ['O status deve ser um True ou False.'],
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    });
  });
});

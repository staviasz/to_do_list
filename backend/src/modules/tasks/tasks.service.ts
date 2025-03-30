import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly dbClient: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    return await this.dbClient.tasks.create({
      data: {
        description: createTaskDto.description,
        dateOfCompletion: new Date(createTaskDto.dateOfCompletion),
        completed: false,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const { description, dateOfCompletion, completed } = updateTaskDto;

    const task = await this.dbClient.tasks.findFirstOrThrow({
      where: {
        id,
        user_id: userId,
      },
    });

    const newTask = {
      description: description || task.description,
      dateOfCompletion: dateOfCompletion
        ? new Date(dateOfCompletion)
        : task.dateOfCompletion,
      completed: completed || task.completed,
    };

    return await this.dbClient.tasks.update({
      where: {
        id,
        user_id: userId,
      },
      data: newTask,
    });
  }

  async findAll(userId: number) {
    return await this.dbClient.tasks.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async findOne(id: number, userId: number) {
    return await this.dbClient.tasks.findFirstOrThrow({
      where: {
        id,
        user_id: userId,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.dbClient.tasks.delete({
      where: {
        id,
        user_id: userId,
      },
    });
    return;
  }
}

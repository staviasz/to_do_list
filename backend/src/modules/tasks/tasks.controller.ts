import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserAuthGuard } from '../user/guards/user-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@UseGuards(UserAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req: Request, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto, req.user!.id);
  }

  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const { description, dateOfCompletion, completed } = updateTaskDto;
    if (!description && !dateOfCompletion && !completed) {
      throw new BadRequestException('Nenhuma informação foi fornecida');
    }

    return this.tasksService.update(+id, updateTaskDto, req.user!.id);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.tasksService.findAll(req.user!.id);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.findOne(+id, req.user!.id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.remove(+id, req.user!.id);
  }
}

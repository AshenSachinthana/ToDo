import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Res,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.model';
import { Response } from 'express';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Res() res: Response): Promise<any> {
    try {
      const data = await this.taskService.findAll();
      return res.status(HttpStatus.OK).send({
        code: '200',
        message: 'Tasks retrieved successfully',
        timestamp: new Date().toISOString(),
        data,
        count: data.length,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        code: '500',
        message: 'Failed to fetch tasks',
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Res() res: Response,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<any> {
    try {
      if (!createTaskDto.Title || !createTaskDto.Description) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          code: '400',
          message: 'Title and Description are required',
          timestamp: new Date().toISOString(),
        });
      }

      const data = await this.taskService.create(createTaskDto);
      return res.status(HttpStatus.CREATED).send({
        code: '201',
        message: 'Task created successfully',
        timestamp: new Date().toISOString(),
        data,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        code: '500',
        message: 'Failed to create task',
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  async markAsCompleted(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      const data = await this.taskService.markAsCompleted(+id);
      return res.status(HttpStatus.OK).send({
        code: '200',
        message: 'Task marked as completed',
        timestamp: new Date().toISOString(),
        data,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          statusCode: 404,
          message: error.message,
          timestamp: new Date().toISOString(),
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        code: '500',
        message: 'Failed to mark task as completed',
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
  }
}
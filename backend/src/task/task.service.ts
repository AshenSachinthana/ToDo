import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async findAll(): Promise<Task[]> {
    try {
      return await this.taskModel.findAll({
        where: {
          IsCompleted: false,
        },
        order: [['CreatedAt', 'DESC']],
        limit: 5,
      });
    } catch (error) {
      throw new Error(`Failed to retrieve tasks: ${error.message}`);
    }
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.taskModel.create({
        Title: createTaskDto.Title,
        Description: createTaskDto.Description,
        IsCompleted: false,
      } as any);
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async markAsCompleted(id: number): Promise<Task> {
    try {
      const task = await this.taskModel.findByPk(id);
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
            
      await task.update({
        IsCompleted: true,
        UpdatedAt: new Date(),
      });
            
      await task.reload();
      
      return task;
    } catch (error) {
      throw new Error(`Failed to mark task as completed: ${error.message}`);
    }
  }
}
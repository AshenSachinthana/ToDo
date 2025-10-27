import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async findAll(): Promise<Task[]> {
    this.logger.log('Fetching all incomplete tasks');
    try {
      const tasks = await this.taskModel.findAll({
        where: {
          IsCompleted: false,
        },
        order: [['CreatedAt', 'DESC']],
        limit: 5,
      });
      this.logger.log(`Successfully retrieved ${tasks.length} incomplete tasks`);
      return tasks;
    } catch (error) {
      this.logger.error(`Failed to retrieve tasks: ${error.message}`, error.stack);
      throw new Error(`Failed to retrieve tasks: ${error.message}`);
    }
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.log(`Creating new task with title: "${createTaskDto.Title}"`);
    try {
      const task = await this.taskModel.create({
        Title: createTaskDto.Title,
        Description: createTaskDto.Description,
        IsCompleted: false,
      } as any);
      this.logger.log(`Successfully created task`);
      return task;
    } catch (error) {
      this.logger.error(`Failed to create task: ${error.message}`, error.stack);
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async markAsCompleted(id: number): Promise<Task> {
    this.logger.log(`Marking task with ID ${id} as completed`);
    try {
      const task = await this.taskModel.findByPk(id);
      if (!task) {
        this.logger.warn(`Task with ID ${id} not found`);
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      await task.update({
        IsCompleted: true,
        UpdatedAt: new Date(),
      });

      await task.reload();

      this.logger.log(`Successfully marked task with ID ${id} as completed`);
      return task;
    } catch (error) {
      this.logger.error(`Failed to mark task as completed: ${error.message}`, error.stack);
      throw new Error(`Failed to mark task as completed: ${error.message}`);
    }
  }
}
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.model';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    findAll: jest.fn(),
    create: jest.fn(),
    markAsCompleted: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const mockTask: Partial<Task> = {
    Id: 1,
    Title: 'Test Task',
    Description: 'Test Description',
    IsCompleted: false,
    CreatedAt: new Date('2024-01-01'),
    UpdatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks with success response', async () => {
      const tasks = [mockTask, { ...mockTask, Id: 2 }] as Task[];
      mockTaskService.findAll.mockResolvedValue(tasks);

      const res = mockResponse();
      await controller.findAll(res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        code: '200',
        message: 'Tasks retrieved successfully',
        timestamp: expect.any(String),
        data: tasks,
        count: 2,
      });
    });

    it('should return empty array when no tasks exist', async () => {
      mockTaskService.findAll.mockResolvedValue([]);

      const res = mockResponse();
      await controller.findAll(res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        code: '200',
        message: 'Tasks retrieved successfully',
        timestamp: expect.any(String),
        data: [],
        count: 0,
      });
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'Database connection failed';
      mockTaskService.findAll.mockRejectedValue(new Error(errorMessage));

      const res = mockResponse();
      await controller.findAll(res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        code: '500',
        message: 'Failed to fetch tasks',
        timestamp: expect.any(String),
        error: errorMessage,
      });
    });
  });

  describe('create', () => {
    const createTaskDto: CreateTaskDto = {
      Title: 'New Task',
      Description: 'New Description',
    };

    it('should create a task successfully', async () => {
      const createdTask = { ...mockTask, ...createTaskDto } as Task;
      mockTaskService.create.mockResolvedValue(createdTask);

      const res = mockResponse();
      await controller.create(res, createTaskDto);

      expect(service.create).toHaveBeenCalledWith(createTaskDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        code: '201',
        message: 'Task created successfully',
        timestamp: expect.any(String),
        data: createdTask,
      });
    });

    it('should return 400 when Title is missing', async () => {
      const invalidDto = { Description: 'Test' } as CreateTaskDto;

      const res = mockResponse();
      await controller.create(res, invalidDto);

      expect(service.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith({
        code: '400',
        message: 'Title and Description are required',
        timestamp: expect.any(String),
      });
    });

    it('should return 400 when Description is missing', async () => {
      const invalidDto = { Title: 'Test' } as CreateTaskDto;

      const res = mockResponse();
      await controller.create(res, invalidDto);

      expect(service.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith({
        code: '400',
        message: 'Title and Description are required',
        timestamp: expect.any(String),
      });
    });

    it('should return 400 when both Title and Description are missing', async () => {
      const invalidDto = {} as CreateTaskDto;

      const res = mockResponse();
      await controller.create(res, invalidDto);

      expect(service.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith({
        code: '400',
        message: 'Title and Description are required',
        timestamp: expect.any(String),
      });
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'Database insert failed';
      mockTaskService.create.mockRejectedValue(new Error(errorMessage));

      const res = mockResponse();
      await controller.create(res, createTaskDto);

      expect(service.create).toHaveBeenCalledWith(createTaskDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        code: '500',
        message: 'Failed to create task',
        timestamp: expect.any(String),
        error: errorMessage,
      });
    });
  });

  describe('markAsCompleted', () => {
    const taskId = '1';

    it('should mark task as completed successfully', async () => {
      const completedTask = { ...mockTask, IsCompleted: true } as Task;
      mockTaskService.markAsCompleted.mockResolvedValue(completedTask);

      const res = mockResponse();
      await controller.markAsCompleted(res, taskId);

      expect(service.markAsCompleted).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        code: '200',
        message: 'Task marked as completed',
        timestamp: expect.any(String),
        data: completedTask,
      });
    });

    it('should handle string ID conversion to number', async () => {
      const completedTask = { ...mockTask, IsCompleted: true } as Task;
      mockTaskService.markAsCompleted.mockResolvedValue(completedTask);

      const res = mockResponse();
      await controller.markAsCompleted(res, '42');

      expect(service.markAsCompleted).toHaveBeenCalledWith(42);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'Task not found';
      mockTaskService.markAsCompleted.mockRejectedValue(new Error(errorMessage));

      const res = mockResponse();
      await controller.markAsCompleted(res, taskId);

      expect(service.markAsCompleted).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        code: '500',
        message: 'Failed to mark task as completed',
        timestamp: expect.any(String),
        error: errorMessage,
      });
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database update failed';
      mockTaskService.markAsCompleted.mockRejectedValue(new Error(errorMessage));

      const res = mockResponse();
      await controller.markAsCompleted(res, taskId);

      expect(service.markAsCompleted).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        code: '500',
        message: 'Failed to mark task as completed',
        timestamp: expect.any(String),
        error: errorMessage,
      });
    });
  });
});

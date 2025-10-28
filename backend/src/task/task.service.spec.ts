import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let mockTaskModel: any;

  const mockTask = {
    Id: 1,
    Title: 'Test Task',
    Description: 'Test Description',
    IsCompleted: false,
    CreatedAt: new Date('2024-01-01'),
    UpdatedAt: new Date('2024-01-01'),
    update: jest.fn(),
    reload: jest.fn(),
  };

  beforeEach(async () => {
    mockTaskModel = {
      findAll: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken(Task),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return incomplete tasks ordered by CreatedAt DESC with limit 5', async () => {
      const tasks = [
        { ...mockTask },
        { ...mockTask, Id: 2, CreatedAt: new Date('2024-01-02') },
      ];
      mockTaskModel.findAll.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(mockTaskModel.findAll).toHaveBeenCalledWith({
        where: {
          IsCompleted: false,
        },
        order: [['CreatedAt', 'DESC']],
        limit: 5,
      });
      expect(result).toEqual(tasks);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no incomplete tasks exist', async () => {
      mockTaskModel.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockTaskModel.findAll).toHaveBeenCalledWith({
        where: {
          IsCompleted: false,
        },
        order: [['CreatedAt', 'DESC']],
        limit: 5,
      });
      expect(result).toEqual([]);
    });

    it('should filter only incomplete tasks (IsCompleted: false)', async () => {
      const incompleteTasks = [
        { ...mockTask, Id: 1, IsCompleted: false },
        { ...mockTask, Id: 2, IsCompleted: false },
      ];
      mockTaskModel.findAll.mockResolvedValue(incompleteTasks);

      const result = await service.findAll();

      expect(mockTaskModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { IsCompleted: false },
        }),
      );
      expect(result).toEqual(incompleteTasks);
    });

    it('should throw error when database query fails', async () => {
      const errorMessage = 'Database connection error';
      mockTaskModel.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(service.findAll()).rejects.toThrow(
        `Failed to retrieve tasks: ${errorMessage}`,
      );
      expect(mockTaskModel.findAll).toHaveBeenCalled();
    });

    it('should handle database timeout error', async () => {
      mockTaskModel.findAll.mockRejectedValue(new Error('Timeout'));

      await expect(service.findAll()).rejects.toThrow(
        'Failed to retrieve tasks: Timeout',
      );
    });
  });

  describe('create', () => {
    const createTaskDto: CreateTaskDto = {
      Title: 'New Task',
      Description: 'New Description',
    };

    it('should create a task with provided Title and Description', async () => {
      const createdTask = {
        ...mockTask,
        Title: createTaskDto.Title,
        Description: createTaskDto.Description,
      };
      mockTaskModel.create.mockResolvedValue(createdTask);

      const result = await service.create(createTaskDto);

      expect(mockTaskModel.create).toHaveBeenCalledWith({
        Title: createTaskDto.Title,
        Description: createTaskDto.Description,
        IsCompleted: false,
      });
      expect(result).toEqual(createdTask);
    });

    it('should set IsCompleted to false by default', async () => {
      mockTaskModel.create.mockResolvedValue(mockTask);

      await service.create(createTaskDto);

      expect(mockTaskModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          IsCompleted: false,
        }),
      );
    });

    it('should create task with all required fields', async () => {
      mockTaskModel.create.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(mockTaskModel.create).toHaveBeenCalledWith({
        Title: createTaskDto.Title,
        Description: createTaskDto.Description,
        IsCompleted: false,
      });
      expect(result).toBeDefined();
    });

    it('should throw error when database insert fails', async () => {
      const errorMessage = 'Insert failed';
      mockTaskModel.create.mockRejectedValue(new Error(errorMessage));

      await expect(service.create(createTaskDto)).rejects.toThrow(
        `Failed to create task: ${errorMessage}`,
      );
      expect(mockTaskModel.create).toHaveBeenCalled();
    });

    it('should handle constraint violation error', async () => {
      const errorMessage = 'Unique constraint violation';
      mockTaskModel.create.mockRejectedValue(new Error(errorMessage));

      await expect(service.create(createTaskDto)).rejects.toThrow(
        `Failed to create task: ${errorMessage}`,
      );
    });
  });

  describe('markAsCompleted', () => {
    const taskId = 1;

    it('should update task IsCompleted to true and UpdatedAt', async () => {
      const task = { ...mockTask };
      mockTaskModel.findByPk.mockResolvedValue(task);
      task.update.mockResolvedValue(task);
      task.reload.mockResolvedValue(task);

      const result = await service.markAsCompleted(taskId);

      expect(mockTaskModel.findByPk).toHaveBeenCalledWith(taskId);
      expect(task.update).toHaveBeenCalledWith({
        IsCompleted: true,
        UpdatedAt: expect.any(Date),
      });
      expect(task.reload).toHaveBeenCalled();
      expect(result).toEqual(task);
    });

    it('should reload task after update to get fresh data', async () => {
      const task = { ...mockTask };
      mockTaskModel.findByPk.mockResolvedValue(task);
      task.update.mockResolvedValue(task);
      task.reload.mockResolvedValue(task);

      await service.markAsCompleted(taskId);

      expect(task.update).toHaveBeenCalled();
      expect(task.reload).toHaveBeenCalled();
    });

    it('should throw NotFoundException when task ID does not exist', async () => {
      mockTaskModel.findByPk.mockResolvedValue(null);

      await expect(service.markAsCompleted(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.markAsCompleted(999)).rejects.toThrow(
        'Task with ID 999 not found',
      );
      expect(mockTaskModel.findByPk).toHaveBeenCalledWith(999);
    });

    it('should throw error when database update fails', async () => {
      const task = { ...mockTask };
      const errorMessage = 'Update failed';
      mockTaskModel.findByPk.mockResolvedValue(task);
      task.update.mockRejectedValue(new Error(errorMessage));

      await expect(service.markAsCompleted(taskId)).rejects.toThrow(
        errorMessage,
      );
    });

    it('should handle task not found during update', async () => {
      mockTaskModel.findByPk.mockResolvedValue(null);

      await expect(service.markAsCompleted(taskId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.markAsCompleted(taskId)).rejects.toThrow(
        `Task with ID ${taskId} not found`,
      );
    });

    it('should handle concurrent update conflicts', async () => {
      const task = { ...mockTask };
      mockTaskModel.findByPk.mockResolvedValue(task);
      task.update.mockRejectedValue(new Error('Concurrent update conflict'));

      await expect(service.markAsCompleted(taskId)).rejects.toThrow(
        'Concurrent update conflict',
      );
    });

    it('should handle different task IDs', async () => {
      const task = { ...mockTask, Id: 42 };
      mockTaskModel.findByPk.mockResolvedValue(task);
      task.update.mockResolvedValue(task);
      task.reload.mockResolvedValue(task);

      await service.markAsCompleted(42);

      expect(mockTaskModel.findByPk).toHaveBeenCalledWith(42);
      expect(task.update).toHaveBeenCalled();
    });
  });
});

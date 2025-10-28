import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/sequelize';
import { Task } from '../src/task/task.model';

describe('Task API (e2e)', () => {
  let app: INestApplication;
  let createdTaskId: number;
  let taskModel: typeof Task;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    // Get the Task model for cleanup
    taskModel = moduleFixture.get(getModelToken(Task));
  }, 40000);

  // Clean database before each test
  beforeEach(async () => {
    await taskModel.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  }, 10000);

  describe('Task Creation & Listing', () => {
    it('should create a task and list it', async () => {
      const newTask = {
        Title: 'Test Task',
        Description: 'Test Description',
      };

      // Create
      const createRes = await request(app.getHttpServer())
        .post('/task')
        .send(newTask)
        .expect(201)
        .expect((res) => {
          expect(res.body.code).toBe('201');
          expect(res.body.message).toBe('Task created successfully');
          expect(res.body.data.Id).toBeDefined();
          expect(res.body.data.Title).toBe(newTask.Title);
          expect(res.body.data.Description).toBe(newTask.Description);
          expect(res.body.data.IsCompleted).toBe(false);
          createdTaskId = res.body.data.Id;
        });

      // List (should include it as incomplete)
      await request(app.getHttpServer())
        .get('/task')
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe('200');
          expect(res.body.message).toBe('Tasks retrieved successfully');
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].Id).toBe(createdTaskId);
          expect(res.body.data[0].IsCompleted).toBe(false);
          expect(res.body.count).toBe(1);
        });
    });
  });

  describe('/task/:id/complete (PATCH)', () => {
    beforeEach(async () => {
      // Create a fresh task for this describe block
      const createRes = await request(app.getHttpServer())
        .post('/task')
        .send({ Title: 'Completable Task', Description: 'For PATCH test' })
        .expect(201);
      createdTaskId = createRes.body.data.Id;
    });

    it('should mark task as completed', async () => {
      await request(app.getHttpServer())
        .patch(`/task/${createdTaskId}/complete`)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe('200');
          expect(res.body.message).toBe('Task marked as completed');
          expect(res.body.data.Id).toBe(createdTaskId);
          expect(res.body.data.IsCompleted).toBe(true);
        });

      // Verify: List should now exclude it (service filters IsCompleted=false)
      await request(app.getHttpServer())
        .get('/task')
        .expect(200)
        .expect((res) => expect(res.body.data).toHaveLength(0));
    });

    it('should return 404 for non-existent task', async () => {
      await request(app.getHttpServer())
        .patch('/task/99999/complete')
        .expect(404)
        .expect((res) => {
          expect(res.body.statusCode).toBe(404);
          expect(res.body.message).toBe('Task with ID 99999 not found');
        });
    });
  });

  describe('Full Task Flow (e2e)', () => {
    it('should complete full task lifecycle', async () => {
      // Step 1: Create
      const createRes = await request(app.getHttpServer())
        .post('/task')
        .send({ Title: 'Lifecycle Task', Description: 'Full flow test' })
        .expect(201);
      const taskId = createRes.body.data.Id;

      // Step 2: List initial (incomplete)
      const initialList = await request(app.getHttpServer())
        .get('/task')
        .expect(200);
      expect(initialList.body.data).toHaveLength(1);
      const incompleteTask = initialList.body.data[0];
      expect(incompleteTask.IsCompleted).toBe(false);

      // Step 3: Complete
      const completeRes = await request(app.getHttpServer())
        .patch(`/task/${taskId}/complete`)
        .expect(200);
      const completedTask = completeRes.body.data;

      // Step 4: List after (should be empty)
      const finalList = await request(app.getHttpServer())
        .get('/task')
        .expect(200);
      expect(finalList.body.data).toHaveLength(0);

      // Assertions
      expect(completedTask.IsCompleted).toBe(true);
      expect(incompleteTask.IsCompleted).toBe(false);
    });
  });
});
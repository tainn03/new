import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';
import handler from '../index';
import { TaskService } from '../../../../server/application/services/TaskService';
import { AppDataSource } from '../../../../server/config/dataSource';

// Mock TaskService
jest.mock('../../../../server/application/services/TaskService');

describe('/api/tasks', () => {
  let server: any;

  beforeAll(async () => {
    await AppDataSource.initialize(); // Initialize TypeORM for tests
    server = createServer((req, res) => {
      apiResolver(req, res, undefined, handler, {}, false);
    });
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/tasks returns all tasks', async () => {
    const mockTasks = [
      {
        key: '1',
        title: 'Test Task',
        status: 'OPEN',
        priority: 'HIGH',
        deadline: '2025-06-10T10:00:00',
        createdAt: '2025-06-01T09:00:00',
        updatedAt: '2025-06-02T12:00:00',
      },
    ];
    (TaskService as jest.Mock).mockImplementation(() => ({
      getAllTasks: jest.fn().mockResolvedValue(mockTasks),
    }));

    const response = await request(server).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTasks);
  });

  it('POST /api/tasks creates a new task', async () => {
    const newTask = {
      title: 'New Task',
      deadline: '2025-06-10T10:00:00',
    };
    const createdTask = {
      ...newTask,
      key: '2',
      status: 'OPEN',
      priority: 'MEDIUM',
      createdAt: '2025-06-01T09:00:00',
      updatedAt: '2025-06-01T09:00:00',
    };
    (TaskService as jest.Mock).mockImplementation(() => ({
      createTask: jest.fn().mockResolvedValue(createdTask),
    }));

    const response = await request(server)
      .post('/api/tasks')
      .send(newTask)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdTask);
  });
});
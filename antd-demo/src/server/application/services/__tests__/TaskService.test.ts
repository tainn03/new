import { TaskService } from '../TaskService';
import { TaskRepository } from '../../../repository/TaskRepository';
import { Task } from '../../../domain/entities/Task';

// Mock TaskRepository
jest.mock('../../../repository/TaskRepository');

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepo: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepo = new TaskRepository() as jest.Mocked<TaskRepository>;
    (TaskRepository as jest.Mock).mockImplementation(() => mockTaskRepo);
    taskService = new TaskService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getAllTasks returns all tasks', async () => {
    const mockTasks: Task[] = [
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
    mockTaskRepo.findAll.mockResolvedValue(mockTasks);

    const tasks = await taskService.getAllTasks();
    expect(tasks).toEqual(mockTasks);
    expect(mockTaskRepo.findAll).toHaveBeenCalled();
  });

  it('createTask throws error if title is missing', async () => {
    await expect(taskService.createTask({ deadline: '2025-06-10T10:00:00' })).rejects.toThrow(
      'Title and deadline are required'
    );
  });

  it('createTask creates task with default values', async () => {
    const newTask = {
      title: 'New Task',
      deadline: '2025-06-10T10:00:00',
    };
    const createdTask: Task = {
      ...newTask,
      key: '2',
      status: 'OPEN',
      priority: 'MEDIUM',
      createdAt: '2025-06-01T09:00:00',
      updatedAt: '2025-06-01T09:00:00',
    };
    mockTaskRepo.create.mockReturnValue(createdTask);
    mockTaskRepo.save.mockResolvedValue(createdTask);

    const result = await taskService.createTask(newTask);
    expect(result).toEqual(createdTask);
    expect(mockTaskRepo.create).toHaveBeenCalledWith({
      ...newTask,
      status: 'OPEN',
      priority: 'MEDIUM',
    });
  });
});
import { TaskRepository } from "../../repository/TaskRepository";
import { Task } from "../../domain/entities/Task";

export class TaskService {
  private taskRepo: TaskRepository;

  constructor() {
    this.taskRepo = new TaskRepository();
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepo.findAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    const task = await this.taskRepo.findById(id);
    if (!task) throw new Error("Task not found");
    return task;
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    if (!task.title || !task.deadline) {
      throw new Error("Title and deadline are required");
    }
    return this.taskRepo.create({
      ...task,
      status: task.status || "OPEN",
      priority: task.priority || "MEDIUM",
    });
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) throw new Error("Task not found");
    return (await this.taskRepo.update(id, task))!;
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.getTaskById(id);
    if (!task) throw new Error("Task not found");
    await this.taskRepo.delete(id);
  }
}
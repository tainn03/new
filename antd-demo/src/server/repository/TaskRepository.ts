import { Repository } from "typeorm";
import { AppDataSource } from "../config/dataSource";
import { Task } from "../domain/entities/Task";

export class TaskRepository {
  private repo: Repository<Task>;

  constructor() {
    this.repo = AppDataSource.getRepository(Task);
  }

  async findAll(): Promise<Task[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Task | null> {
    return this.repo.findOneBy({ key: id });
  }

  async create(task: Partial<Task>): Promise<Task> {
    const newTask = this.repo.create(task);
    return this.repo.save(newTask);
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    await this.repo.update(id, task);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
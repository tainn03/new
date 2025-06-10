import { NextApiRequest, NextApiResponse } from "next";
import { TaskService } from "../../../../src/server/application/services/TaskService";
import { AppDataSource } from "../../../../src/server/config/dataSource";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await AppDataSource.initialize(); // Khởi tạo TypeORM
  const taskService = new TaskService();

  try {
    switch (req.method) {
      case "GET":
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
        break;

      case "POST":
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  } finally {
    await AppDataSource.destroy(); // Đóng kết nối
  }
}
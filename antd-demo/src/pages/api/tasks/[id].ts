import { NextApiRequest, NextApiResponse } from "next";
import { TaskService } from "../../../../src/server/application/services/TaskService";
import { AppDataSource } from "../../../../src/server/config/dataSource";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await AppDataSource.initialize();
  const taskService = new TaskService();
  const { id } = req.query;

  try {
    switch (req.method) {
      case "GET":
        const task = await taskService.getTaskById(id as string);
        res.status(200).json(task);
        break;

      case "PATCH":
        const updatedTask = await taskService.updateTask(id as string, req.body);
        res.status(200).json(updatedTask);
        break;

      case "DELETE":
        await taskService.deleteTask(id as string);
        res.status(204).end();
        break;

      default:
        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  } finally {
    await AppDataSource.destroy();
  }
}
import { DataSource } from "typeorm";
import { Task } from "../domain/entities/Task";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // Tự động tạo bảng khi khởi động (không dùng trong production)
  logging: true, // Ghi log các truy vấn SQL
  entities: [Task],
  migrations: [],
  subscribers: [],
});
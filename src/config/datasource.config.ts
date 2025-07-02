import { DataSource } from "typeorm";
import { Users } from "../entities/user.entity";

export class AppDataSource {
    static instance: AppDataSource;
    private dataSource: DataSource;

    private constructor() {
        this.dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            entities: [Users],
            synchronize: true,
            logging: false,
        });
    }

    static getInstance(): DataSource {
        if (!AppDataSource.instance) {
            AppDataSource.instance = new AppDataSource();
        }
        return AppDataSource.instance.dataSource;
    }

    getDataSource(): DataSource {
        return this.dataSource;
    }

    async initialize(): Promise<void> {
        if (!this.dataSource.isInitialized) {
            try {
                await this.dataSource.initialize();
            } catch (error) {
                throw error;
            }
        }
    }

    async destroy(): Promise<void> {
        if (this.dataSource.isInitialized) {
            await this.dataSource.destroy();
        }
    }
}
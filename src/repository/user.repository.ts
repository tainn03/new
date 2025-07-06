import { Repository } from "typeorm";
import { Users } from "../entities/user.entity";
import { AppDataSource } from "../config/datasource.config";

export class UserRepository{
    private ormRepository: Repository<Users>;

    constructor(){
        this.ormRepository = AppDataSource.getInstance().getRepository(Users);
    } 

    async findAll(): Promise<Users[]>{
        return this.ormRepository.find();
    }

    async findById(id: number): Promise<Users | null>{
        return this.ormRepository.findOne({
            where: {
                id
            }
        });
    }

    async create(user: Partial<Users>): Promise<Users>{
        const newUser = this.ormRepository.create(user);
        return this.ormRepository.save(newUser); 
    }

    async update(id: number, user: Partial<Users>): Promise<Users | null>{
        await this.ormRepository.update(id, user);
        return this.ormRepository.findOne({
            where: {
                id
            }
        });
    }

    async delete(id: number): Promise<void>{
        await this.ormRepository.delete(id);
    }

    async findByEmail(email: string): Promise<Users | null>{
        return this.ormRepository.findOne({
            where: {
                email
            }
        });
    }
}
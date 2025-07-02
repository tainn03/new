import { Users } from "../entities/user.entity";
import { UserRepository } from "../repository/user.repository";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers(): Promise<Users[]> {
        return this.userRepository.findAll();
    }

    async getUserById(id: number): Promise<Users | null> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }

    async createUser(name: string, email: string): Promise<Users> {
        if (!name || !email) {
            throw new Error('Name and email are required');
        }
        return this.userRepository.create({ name, email });
    }

    async updateUser(id: number, name?: string, email?: string): Promise<Users | null> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return this.userRepository.update(id, { name, email });
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        await this.userRepository.delete(id);
    }
}
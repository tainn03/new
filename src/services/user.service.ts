import { Users } from "../entities/user.entity";
import { UserRepository } from "../repository/user.repository";
import { authService } from "./auth.service";

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

    async getUserByEmail(email: string): Promise<Users | null> {
        return this.userRepository.findByEmail(email);
    }

    async createUser(name: string, email: string, password: string): Promise<Users> {
        if (!name || !email || !password) {
            throw new Error('Name, email, and password are required');
        }

        // Check if user already exists
        const existingUser = await this.getUserByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await authService.hashPassword(password);
        return this.userRepository.create({ name, email, password: hashedPassword });
    }

    async validateUser(email: string, password: string): Promise<Users | null> {
        const user = await this.getUserByEmail(email);
        if (!user) {
            return null;
        }

        const isValidPassword = await authService.comparePassword(password, user.password);
        if (!isValidPassword) {
            return null;
        }

        return user;
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
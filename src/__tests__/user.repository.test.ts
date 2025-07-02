import { Repository } from "typeorm";
import { Users } from "../entities/user.entity";
import { UserRepository } from "../repository/user.repository";
import { AppDataSource } from "../config/datasource.config";

// Mock the AppDataSource
jest.mock("../config/datasource.config");

describe("UserRepository", () => {
    let userRepository: UserRepository;
    let mockRepository: jest.Mocked<Repository<Users>>;
    let mockDataSource: jest.Mocked<any>;

    beforeEach(() => {
        mockRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<Repository<Users>>;

        mockDataSource = {
            getRepository: jest.fn().mockReturnValue(mockRepository),
            initialize: jest.fn().mockResolvedValue(undefined),
            destroy: jest.fn().mockResolvedValue(undefined),
        };

        (AppDataSource.getInstance as jest.Mock).mockReturnValue(mockDataSource);

        userRepository = new UserRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a user", async () => {
            const userData = { name: "Alice", email: "alice@example.com" };
            const createdUser: Users = { id: 1, name: "Alice", email: "alice@example.com" };

            mockRepository.create.mockReturnValue(createdUser);
            mockRepository.save.mockResolvedValue(createdUser);

            const result = await userRepository.create(userData);

            expect(mockRepository.create).toHaveBeenCalledWith(userData);
            expect(mockRepository.save).toHaveBeenCalledWith(createdUser);
            expect(result).toEqual(createdUser);
        });
    });

    describe("findAll", () => {
        it("should find all users", async () => {
            const users: Users[] = [
                { id: 1, name: "Alice", email: "alice@example.com" },
                { id: 2, name: "Bob", email: "bob@example.com" }
            ];

            mockRepository.find.mockResolvedValue(users);

            const result = await userRepository.findAll();

            expect(mockRepository.find).toHaveBeenCalledTimes(1);
            expect(result).toEqual(users);
        });

        it("should return empty array when no users exist", async () => {
            mockRepository.find.mockResolvedValue([]);

            const result = await userRepository.findAll();

            expect(result).toEqual([]);
        });
    });

    describe("findById", () => {
        it("should find a user by id", async () => {
            const user: Users = { id: 1, name: "Bob", email: "bob@example.com" };

            mockRepository.findOne.mockResolvedValue(user);

            const result = await userRepository.findById(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(result).toEqual(user);
        });

        it("should return null when user is not found", async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const result = await userRepository.findById(999);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 999 }
            });
            expect(result).toBeNull();
        });
    });

    describe("update", () => {
        it("should update a user", async () => {
            const updateData = { name: "Caroline" };
            const updatedUser: Users = { id: 1, name: "Caroline", email: "carol@example.com" };

            mockRepository.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });
            mockRepository.findOne.mockResolvedValue(updatedUser);

            const result = await userRepository.update(1, updateData);

            expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(result).toEqual(updatedUser);
        });

        it("should return null when user to update is not found", async () => {
            const updateData = { name: "NonExistent" };

            mockRepository.update.mockResolvedValue({ affected: 0, generatedMaps: [], raw: [] });
            mockRepository.findOne.mockResolvedValue(null);

            const result = await userRepository.update(999, updateData);

            expect(mockRepository.update).toHaveBeenCalledWith(999, updateData);
            expect(result).toBeNull();
        });
    });

    describe("delete", () => {
        it("should delete a user", async () => {
            mockRepository.delete.mockResolvedValue({ affected: 1, raw: [] });

            await userRepository.delete(1);

            expect(mockRepository.delete).toHaveBeenCalledWith(1);
        });

        it("should handle deletion of non-existent user", async () => {
            mockRepository.delete.mockResolvedValue({ affected: 0, raw: [] });

            await userRepository.delete(999);

            expect(mockRepository.delete).toHaveBeenCalledWith(999);
        });
    });
});
import { UserService } from "../services/user.service";
import { UserRepository } from "../repository/user.repository";
import { Users } from "../entities/user.entity";

describe("UserService", () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockUserRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        userService = new UserService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("should create a user successfully", async () => {
            const userData = { name: "Alice", email: "alice@example.com" };
            const createdUser: Users = { id: 1, name: "Alice", email: "alice@example.com" };

            mockUserRepository.create.mockResolvedValue(createdUser);

            const result = await userService.createUser("Alice", "alice@example.com");

            expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual(createdUser);
        });

        it("should throw error when name is empty", async () => {
            await expect(userService.createUser("", "alice@example.com")).rejects.toThrow("Name and email are required");
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });

        it("should throw error when email is empty", async () => {
            await expect(userService.createUser("Alice", "")).rejects.toThrow("Name and email are required");
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });

        it("should throw error when both name and email are empty", async () => {
            await expect(userService.createUser("", "")).rejects.toThrow("Name and email are required");
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            const users: Users[] = [
                { id: 1, name: "Alice", email: "alice@example.com" },
                { id: 2, name: "Bob", email: "bob@example.com" }
            ];

            mockUserRepository.findAll.mockResolvedValue(users);

            const result = await userService.getAllUsers();

            expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(users);
        });

        it("should return empty array when no users exist", async () => {
            mockUserRepository.findAll.mockResolvedValue([]);

            const result = await userService.getAllUsers();

            expect(result).toEqual([]);
        });
    });

    describe("getUserById", () => {
        it("should return a user when found", async () => {
            const user: Users = { id: 1, name: "Bob", email: "bob@example.com" };

            mockUserRepository.findById.mockResolvedValue(user);

            const result = await userService.getUserById(1);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(user);
        });

        it("should throw error when user is not found", async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.getUserById(999)).rejects.toThrow("User with id 999 not found");
            expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
        });
    });

    describe("updateUser", () => {
        it("should update a user successfully", async () => {
            const existingUser: Users = { id: 1, name: "Carol", email: "carol@example.com" };
            const updatedUser: Users = { id: 1, name: "Caroline", email: "carol@example.com" };

            mockUserRepository.findById.mockResolvedValue(existingUser);
            mockUserRepository.update.mockResolvedValue(updatedUser);

            const result = await userService.updateUser(1, "Caroline");

            expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
            expect(mockUserRepository.update).toHaveBeenCalledWith(1, { name: "Caroline", email: undefined });
            expect(result).toEqual(updatedUser);
        });

        it("should update user with both name and email", async () => {
            const existingUser: Users = { id: 1, name: "Carol", email: "carol@example.com" };
            const updatedUser: Users = { id: 1, name: "Caroline", email: "caroline@example.com" };

            mockUserRepository.findById.mockResolvedValue(existingUser);
            mockUserRepository.update.mockResolvedValue(updatedUser);

            const result = await userService.updateUser(1, "Caroline", "caroline@example.com");

            expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
            expect(mockUserRepository.update).toHaveBeenCalledWith(1, { name: "Caroline", email: "caroline@example.com" });
            expect(result).toEqual(updatedUser);
        });

        it("should throw error when user to update is not found", async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.updateUser(999, "Ghost")).rejects.toThrow("User with id 999 not found");
            expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
            expect(mockUserRepository.update).not.toHaveBeenCalled();
        });
    });

    describe("deleteUser", () => {
        it("should delete a user successfully", async () => {
            const existingUser: Users = { id: 1, name: "Dave", email: "dave@example.com" };

            mockUserRepository.findById.mockResolvedValue(existingUser);
            mockUserRepository.delete.mockResolvedValue(undefined);

            await userService.deleteUser(1);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
            expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
        });

        it("should throw error when user to delete is not found", async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.deleteUser(999)).rejects.toThrow("User with id 999 not found");
            expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
            expect(mockUserRepository.delete).not.toHaveBeenCalled();
        });
    });
});

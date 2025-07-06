import { UserService } from "../services/user.service";
import { UserRepository } from "../repository/user.repository";
import { Users } from "../entities/user.entity";
import { authService } from "../services/auth.service";

// Mock the auth service
jest.mock("../services/auth.service", () => ({
    authService: {
        hashPassword: jest.fn(),
        comparePassword: jest.fn(),
    },
}));

describe("UserService", () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockAuthService: jest.Mocked<typeof authService>;

    beforeEach(() => {
        mockUserRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        mockAuthService = authService as jest.Mocked<typeof authService>;
        
        userService = new UserService();
        (userService as any).userRepository = mockUserRepository;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("should create a user successfully", async () => {
            const userData = { name: "Alice", email: "alice@example.com", password: "password123" };
            const hashedPassword = "hashedPassword123";
            const createdUser: Users = { 
                id: 1, 
                name: "Alice", 
                email: "alice@example.com", 
                password: hashedPassword 
            };

            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockAuthService.hashPassword.mockResolvedValue(hashedPassword);
            mockUserRepository.create.mockResolvedValue(createdUser);

            const result = await userService.createUser(userData.name, userData.email, userData.password);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(mockAuthService.hashPassword).toHaveBeenCalledWith(userData.password);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
            });
            expect(result).toEqual(createdUser);
        });

        it("should throw an error if user already exists", async () => {
            const userData = { name: "Alice", email: "alice@example.com", password: "password123" };
            const existingUser: Users = { 
                id: 1, 
                name: "Alice", 
                email: "alice@example.com", 
                password: "hashedPassword" 
            };

            mockUserRepository.findByEmail.mockResolvedValue(existingUser);

            await expect(userService.createUser(userData.name, userData.email, userData.password))
                .rejects.toThrow("User with this email already exists");

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });

        it("should throw an error if required fields are missing", async () => {
            await expect(userService.createUser("", "alice@example.com", "password123"))
                .rejects.toThrow("Name, email, and password are required");

            await expect(userService.createUser("Alice", "", "password123"))
                .rejects.toThrow("Name, email, and password are required");

            await expect(userService.createUser("Alice", "alice@example.com", ""))
                .rejects.toThrow("Name, email, and password are required");
        });
    });

    describe("validateUser", () => {
        it("should validate user credentials successfully", async () => {
            const email = "alice@example.com";
            const password = "password123";
            const user: Users = { 
                id: 1, 
                name: "Alice", 
                email, 
                password: "hashedPassword123" 
            };

            mockUserRepository.findByEmail.mockResolvedValue(user);
            mockAuthService.comparePassword.mockResolvedValue(true);

            const result = await userService.validateUser(email, password);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(mockAuthService.comparePassword).toHaveBeenCalledWith(password, user.password);
            expect(result).toEqual(user);
        });

        it("should return null if user does not exist", async () => {
            const email = "nonexistent@example.com";
            const password = "password123";

            mockUserRepository.findByEmail.mockResolvedValue(null);

            const result = await userService.validateUser(email, password);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(mockAuthService.comparePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it("should return null if password is invalid", async () => {
            const email = "alice@example.com";
            const password = "wrongpassword";
            const user: Users = { 
                id: 1, 
                name: "Alice", 
                email, 
                password: "hashedPassword123" 
            };

            mockUserRepository.findByEmail.mockResolvedValue(user);
            mockAuthService.comparePassword.mockResolvedValue(false);

            const result = await userService.validateUser(email, password);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(mockAuthService.comparePassword).toHaveBeenCalledWith(password, user.password);
            expect(result).toBeNull();
        });
    });

    describe("getUserByEmail", () => {
        it("should return user by email", async () => {
            const email = "alice@example.com";
            const user: Users = { 
                id: 1, 
                name: "Alice", 
                email, 
                password: "hashedPassword123" 
            };

            mockUserRepository.findByEmail.mockResolvedValue(user);

            const result = await userService.getUserByEmail(email);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toEqual(user);
        });

        it("should return null if user not found", async () => {
            const email = "nonexistent@example.com";

            mockUserRepository.findByEmail.mockResolvedValue(null);

            const result = await userService.getUserByEmail(email);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toBeNull();
        });
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            const users: Users[] = [
                { id: 1, name: "Alice", email: "alice@example.com", password: "hash1" },
                { id: 2, name: "Bob", email: "bob@example.com", password: "hash2" },
            ];

            mockUserRepository.findAll.mockResolvedValue(users);

            const result = await userService.getAllUsers();

            expect(mockUserRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(users);
        });
    });

    describe("getUserById", () => {
        it("should return user by id", async () => {
            const userId = 1;
            const user: Users = { 
                id: userId, 
                name: "Alice", 
                email: "alice@example.com", 
                password: "hashedPassword123" 
            };

            mockUserRepository.findById.mockResolvedValue(user);

            const result = await userService.getUserById(userId);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toEqual(user);
        });

        it("should throw error if user not found", async () => {
            const userId = 999;

            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.getUserById(userId))
                .rejects.toThrow(`User with id ${userId} not found`);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        });
    });

    describe("updateUser", () => {
        it("should update user successfully", async () => {
            const userId = 1;
            const updateData = { name: "Alice Updated", email: "alice.updated@example.com" };
            const existingUser: Users = { 
                id: userId, 
                name: "Alice", 
                email: "alice@example.com", 
                password: "hashedPassword123" 
            };
            const updatedUser: Users = { 
                ...existingUser, 
                ...updateData 
            };

            mockUserRepository.findById.mockResolvedValue(existingUser);
            mockUserRepository.update.mockResolvedValue(updatedUser);

            const result = await userService.updateUser(userId, updateData.name, updateData.email);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
            expect(result).toEqual(updatedUser);
        });

        it("should throw error if user not found", async () => {
            const userId = 999;

            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.updateUser(userId, "New Name", "new@example.com"))
                .rejects.toThrow(`User with id ${userId} not found`);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockUserRepository.update).not.toHaveBeenCalled();
        });
    });

    describe("deleteUser", () => {
        it("should delete user successfully", async () => {
            const userId = 1;
            const existingUser: Users = { 
                id: userId, 
                name: "Alice", 
                email: "alice@example.com", 
                password: "hashedPassword123" 
            };

            mockUserRepository.findById.mockResolvedValue(existingUser);
            mockUserRepository.delete.mockResolvedValue(undefined);

            await userService.deleteUser(userId);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
        });

        it("should throw error if user not found", async () => {
            const userId = 999;

            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.deleteUser(userId))
                .rejects.toThrow(`User with id ${userId} not found`);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockUserRepository.delete).not.toHaveBeenCalled();
        });
    });
});

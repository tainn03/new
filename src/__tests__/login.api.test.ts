import { NextApiRequest, NextApiResponse } from 'next';
import loginHandler from "../pages/api/login/index";
import { UserService } from "../services/user.service";
import { authService } from "../services/auth.service";
import { Users } from "../entities/user.entity";

// Mock dependencies
jest.mock("../services/user.service");
jest.mock("../services/auth.service");

describe("/api/login", () => {
    let mockReq: Partial<NextApiRequest>;
    let mockRes: Partial<NextApiResponse>;
    let mockUserService: jest.Mocked<UserService>;
    let mockAuthService: jest.Mocked<typeof authService>;

    beforeEach(() => {
        mockReq = {
            method: 'POST',
            body: {},
        };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockUserService = {
            validateUser: jest.fn(),
        } as unknown as jest.Mocked<UserService>;

        mockAuthService = authService as jest.Mocked<typeof authService>;
        
        (UserService as jest.MockedClass<typeof UserService>).mockImplementation(() => mockUserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/login", () => {
        it("should login successfully with valid credentials", async () => {
            const loginData = {
                email: "alice@example.com",
                password: "password123",
            };
            const user: Users = {
                id: 1,
                name: "Alice",
                email: "alice@example.com",
                password: "hashedPassword",
            };
            const token = "generated.jwt.token";

            mockReq.body = loginData;
            mockUserService.validateUser.mockResolvedValue(user);
            mockAuthService.generateToken.mockReturnValue(token);

            await loginHandler(mockReq as any, mockRes as NextApiResponse);

            expect(mockUserService.validateUser).toHaveBeenCalledWith(loginData.email, loginData.password);
            expect(mockAuthService.generateToken).toHaveBeenCalledWith({
                id: user.id,
                email: user.email,
                name: user.name,
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    },
                },
                message: 'Login successful',
            });
        });

        it("should return 401 for invalid credentials", async () => {
            const loginData = {
                email: "alice@example.com",
                password: "wrongpassword",
            };

            mockReq.body = loginData;
            mockUserService.validateUser.mockResolvedValue(null);

            await loginHandler(mockReq as any, mockRes as NextApiResponse);

            expect(mockUserService.validateUser).toHaveBeenCalledWith(loginData.email, loginData.password);
            expect(mockAuthService.generateToken).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'Invalid email or password',
            });
        });

        it("should return 400 for invalid email format", async () => {
            const loginData = {
                email: "invalid-email",
                password: "password123",
            };

            mockReq.body = loginData;

            await loginHandler(mockReq as any, mockRes as NextApiResponse);

            expect(mockUserService.validateUser).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'Validation failed',
                message: expect.stringContaining('Invalid email format'),
            });
        });

        it("should return 400 for short password", async () => {
            const loginData = {
                email: "alice@example.com",
                password: "123",
            };

            mockReq.body = loginData;

            await loginHandler(mockReq as any, mockRes as NextApiResponse);

            expect(mockUserService.validateUser).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'Validation failed',
                message: expect.stringContaining('Password must be at least 6 characters'),
            });
        });

        it("should return 400 for missing email", async () => {
            const loginData = {
                password: "password123",
            };

            mockReq.body = loginData;

            await loginHandler(mockReq as any, mockRes as NextApiResponse);

            expect(mockUserService.validateUser).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
        });

        it("should return 400 for missing password", async () => {
            const loginData = {
                email: "alice@example.com",
            };

            mockReq.body = loginData;

            await loginHandler(mockReq as any, mockRes as NextApiResponse);

            expect(mockUserService.validateUser).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
        });
    });

    describe("Non-POST methods", () => {
        it("should return 405 for GET method", async () => {
            mockReq.method = 'GET';

            await loginHandler(mockReq as any, mockRes as NextApiResponse);

            expect(mockRes.status).toHaveBeenCalledWith(405);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'Method GET not allowed',
            });
        });

        it("should return 405 for PUT method", async () => {
            mockReq.method = 'PUT';

            await loginHandler(mockReq as any, mockRes as NextApiResponse);

            expect(mockRes.status).toHaveBeenCalledWith(405);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'Method PUT not allowed',
            });
        });

        it("should return 405 for DELETE method", async () => {
            mockReq.method = 'DELETE';

            await loginHandler(mockReq as any, mockRes as NextApiResponse);

            expect(mockRes.status).toHaveBeenCalledWith(405);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'Method DELETE not allowed',
            });
        });
    });
});

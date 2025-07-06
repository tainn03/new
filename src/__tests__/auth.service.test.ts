import { AuthService } from "../services/auth.service";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock the dependencies
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe("AuthService", () => {
    let authService: AuthService;
    let mockJwt: jest.Mocked<typeof jwt>;
    let mockBcrypt: jest.Mocked<typeof bcrypt>;

    beforeEach(() => {
        authService = new AuthService();
        mockJwt = jwt as jest.Mocked<typeof jwt>;
        mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
        
        // Reset environment variables
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '24h';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("hashPassword", () => {
        it("should hash password successfully", async () => {
            const password = "password123";
            const hashedPassword = "hashedPassword123";

            mockBcrypt.hash.mockResolvedValue(hashedPassword as never);

            const result = await authService.hashPassword(password);

            expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
            expect(result).toBe(hashedPassword);
        });

        it("should handle hashing errors", async () => {
            const password = "password123";
            const error = new Error("Hashing failed");

            mockBcrypt.hash.mockRejectedValue(error);

            await expect(authService.hashPassword(password)).rejects.toThrow("Hashing failed");
        });
    });

    describe("comparePassword", () => {
        it("should return true for valid password", async () => {
            const password = "password123";
            const hashedPassword = "hashedPassword123";

            mockBcrypt.compare.mockResolvedValue(true as never);

            const result = await authService.comparePassword(password, hashedPassword);

            expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
            expect(result).toBe(true);
        });

        it("should return false for invalid password", async () => {
            const password = "wrongpassword";
            const hashedPassword = "hashedPassword123";

            mockBcrypt.compare.mockResolvedValue(false as never);

            const result = await authService.comparePassword(password, hashedPassword);

            expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
            expect(result).toBe(false);
        });

        it("should handle comparison errors", async () => {
            const password = "password123";
            const hashedPassword = "hashedPassword123";
            const error = new Error("Comparison failed");

            mockBcrypt.compare.mockRejectedValue(error);

            await expect(authService.comparePassword(password, hashedPassword))
                .rejects.toThrow("Comparison failed");
        });
    });

    describe("generateToken", () => {
        it("should generate token successfully", () => {
            const payload = { id: 1, email: "alice@example.com", name: "Alice" };
            const token = "generated.jwt.token";

            mockJwt.sign.mockReturnValue(token as never);

            const result = authService.generateToken(payload);

            expect(mockJwt.sign).toHaveBeenCalledWith(payload, 'test-secret', { expiresIn: '24h' });
            expect(result).toBe(token);
        });

        it("should use default values when env vars not set", () => {
            delete process.env.JWT_SECRET;
            delete process.env.JWT_EXPIRES_IN;
            
            const authServiceNew = new AuthService();
            const payload = { id: 1, email: "alice@example.com", name: "Alice" };
            const token = "generated.jwt.token";

            mockJwt.sign.mockReturnValue(token as never);

            const result = authServiceNew.generateToken(payload);

            expect(mockJwt.sign).toHaveBeenCalledWith(payload, 'your-secret-key', { expiresIn: '24h' });
            expect(result).toBe(token);
        });
    });

    describe("verifyToken", () => {
        it("should verify token successfully", () => {
            const token = "valid.jwt.token";
            const decoded = { id: 1, email: "alice@example.com", name: "Alice" };

            mockJwt.verify.mockReturnValue(decoded as never);

            const result = authService.verifyToken(token);

            expect(mockJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
            expect(result).toEqual(decoded);
        });

        it("should return null for invalid token", () => {
            const token = "invalid.jwt.token";

            mockJwt.verify.mockImplementation(() => {
                throw new Error("Invalid token");
            });

            const result = authService.verifyToken(token);

            expect(mockJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
            expect(result).toBeNull();
        });

        it("should return null for expired token", () => {
            const token = "expired.jwt.token";

            mockJwt.verify.mockImplementation(() => {
                const error = new Error("Token expired") as any;
                error.name = 'TokenExpiredError';
                throw error;
            });

            const result = authService.verifyToken(token);

            expect(mockJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
            expect(result).toBeNull();
        });
    });

    describe("extractTokenFromHeader", () => {
        it("should extract token from valid Bearer header", () => {
            const authHeader = "Bearer valid.jwt.token";
            const expectedToken = "valid.jwt.token";

            const result = authService.extractTokenFromHeader(authHeader);

            expect(result).toBe(expectedToken);
        });

        it("should return null for missing header", () => {
            const result = authService.extractTokenFromHeader(undefined);

            expect(result).toBeNull();
        });

        it("should return null for invalid header format", () => {
            const authHeader = "Invalid valid.jwt.token";

            const result = authService.extractTokenFromHeader(authHeader);

            expect(result).toBeNull();
        });

        it("should return null for header without Bearer prefix", () => {
            const authHeader = "valid.jwt.token";

            const result = authService.extractTokenFromHeader(authHeader);

            expect(result).toBeNull();
        });

        it("should handle Bearer header with no token", () => {
            const authHeader = "Bearer ";

            const result = authService.extractTokenFromHeader(authHeader);

            expect(result).toBe("");
        });
    });
});

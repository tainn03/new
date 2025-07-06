import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "../middleware/auth.middleware";
import { ExtendedNextApiRequest } from "../types/api.types";
import { authService } from "../services/auth.service";

// Mock the auth service
jest.mock("../services/auth.service", () => ({
    authService: {
        extractTokenFromHeader: jest.fn(),
        verifyToken: jest.fn(),
    },
}));

describe("Auth Middleware", () => {
    let mockReq: Partial<ExtendedNextApiRequest>;
    let mockRes: Partial<NextApiResponse>;
    let mockHandler: jest.MockedFunction<any>;
    let mockAuthService: jest.Mocked<typeof authService>;

    beforeEach(() => {
        mockReq = {
            headers: {},
        };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockHandler = jest.fn();
        mockAuthService = authService as jest.Mocked<typeof authService>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("withAuth", () => {
        it("should call handler when valid token is provided", async () => {
            const token = "valid.jwt.token";
            const decodedUser = { id: 1, email: "alice@example.com", name: "Alice" };
            
            mockReq.headers = { authorization: `Bearer ${token}` };
            mockAuthService.extractTokenFromHeader.mockReturnValue(token);
            mockAuthService.verifyToken.mockReturnValue(decodedUser);

            const wrappedHandler = withAuth(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockAuthService.extractTokenFromHeader).toHaveBeenCalledWith(`Bearer ${token}`);
            expect(mockAuthService.verifyToken).toHaveBeenCalledWith(token);
            expect(mockReq.user).toEqual(decodedUser);
            expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
        });

        it("should return 401 when no token is provided", async () => {
            mockAuthService.extractTokenFromHeader.mockReturnValue(null);

            const wrappedHandler = withAuth(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockAuthService.extractTokenFromHeader).toHaveBeenCalledWith(undefined);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'Authorization token is required'
            });
            expect(mockHandler).not.toHaveBeenCalled();
        });

        it("should return 401 when token is invalid", async () => {
            const token = "invalid.jwt.token";
            
            mockReq.headers = { authorization: `Bearer ${token}` };
            mockAuthService.extractTokenFromHeader.mockReturnValue(token);
            mockAuthService.verifyToken.mockReturnValue(null);

            const wrappedHandler = withAuth(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockAuthService.extractTokenFromHeader).toHaveBeenCalledWith(`Bearer ${token}`);
            expect(mockAuthService.verifyToken).toHaveBeenCalledWith(token);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'Invalid or expired token'
            });
            expect(mockHandler).not.toHaveBeenCalled();
        });

        it("should return 401 when token verification throws error", async () => {
            const token = "error.jwt.token";
            
            mockReq.headers = { authorization: `Bearer ${token}` };
            mockAuthService.extractTokenFromHeader.mockReturnValue(token);
            mockAuthService.verifyToken.mockImplementation(() => {
                throw new Error("Token verification failed");
            });

            const wrappedHandler = withAuth(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'Authentication failed'
            });
            expect(mockHandler).not.toHaveBeenCalled();
        });
    });
});

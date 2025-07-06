import { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandling } from "../middleware/error.middleware";
import { ExtendedNextApiRequest } from "../types/api.types";
import { loggerService } from "../services/logger.service";

// Mock the logger service
jest.mock("../services/logger.service", () => ({
    loggerService: {
        logError: jest.fn(),
    },
}));

describe("Error Middleware", () => {
    let mockReq: Partial<ExtendedNextApiRequest>;
    let mockRes: Partial<NextApiResponse>;
    let mockHandler: jest.MockedFunction<any>;
    let mockLoggerService: jest.Mocked<typeof loggerService>;

    beforeEach(() => {
        mockReq = {
            requestId: "req_123",
            user: { id: 1, email: "alice@example.com", name: "Alice" },
        };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockHandler = jest.fn();
        mockLoggerService = loggerService as jest.Mocked<typeof loggerService>;
        
        // Set test environment
        process.env.NODE_ENV = 'test';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("withErrorHandling", () => {
        it("should call handler successfully when no error occurs", async () => {
            mockHandler.mockResolvedValue(undefined);

            const wrappedHandler = withErrorHandling(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
        });

        it("should handle generic errors with 500 status", async () => {
            const error = new Error("Something went wrong");
            mockHandler.mockRejectedValue(error);

            const wrappedHandler = withErrorHandling(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockLoggerService.logError).toHaveBeenCalledWith(error, {
                requestId: mockReq.requestId,
                method: undefined, // Since we're not setting method in mock
                url: undefined,    // Since we're not setting url in mock
                userId: mockReq.user?.id,
            });
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: "Something went wrong",
            });
        });

        it("should handle validation errors with 400 status", async () => {
            const error = new Error("Validation failed: Email is required");
            mockHandler.mockRejectedValue(error);

            const wrappedHandler = withErrorHandling(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: "Validation failed: Email is required",
            });
        });

        it("should handle not found errors with 404 status", async () => {
            const error = new Error("User Not found");
            mockHandler.mockRejectedValue(error);

            const wrappedHandler = withErrorHandling(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: "User Not found",
            });
        });

        it("should handle unauthorized errors with 401 status", async () => {
            const error = new Error("Unauthorized access");
            mockHandler.mockRejectedValue(error);

            const wrappedHandler = withErrorHandling(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: "Unauthorized access",
            });
        });

        it("should handle forbidden errors with 403 status", async () => {
            const error = new Error("Forbidden operation");
            mockHandler.mockRejectedValue(error);

            const wrappedHandler = withErrorHandling(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: "Forbidden operation",
            });
        });

        it("should mask error messages in production", async () => {
            process.env.NODE_ENV = 'production';
            const error = new Error("Sensitive error information");
            mockHandler.mockRejectedValue(error);

            const wrappedHandler = withErrorHandling(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: "Internal server error",
            });
        });

        it("should handle non-Error objects", async () => {
            const error = "String error";
            mockHandler.mockRejectedValue(error);

            const wrappedHandler = withErrorHandling(mockHandler);
            await wrappedHandler(mockReq as ExtendedNextApiRequest, mockRes as NextApiResponse);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: "Internal server error",
            });
        });
    });
});

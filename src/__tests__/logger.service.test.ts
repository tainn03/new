import { loggerService } from "../services/logger.service";
import { LogEntry } from "../types/api.types";
import winston from 'winston';

// Mock winston
jest.mock('winston', () => ({
    createLogger: jest.fn(),
    format: {
        combine: jest.fn(),
        timestamp: jest.fn(),
        errors: jest.fn(),
        json: jest.fn(),
        simple: jest.fn(),
    },
    transports: {
        File: jest.fn(),
        Console: jest.fn(),
    },
}));

describe("LoggerService", () => {
    let mockLogger: jest.Mocked<winston.Logger>;

    beforeEach(() => {
        mockLogger = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            add: jest.fn(),
        } as unknown as jest.Mocked<winston.Logger>;

        (winston.createLogger as jest.Mock).mockReturnValue(mockLogger);
        
        // Clear the module cache to get a fresh instance
        jest.resetModules();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("logRequest", () => {
        it("should log request information", () => {
            const logEntry: LogEntry = {
                requestId: "req_123",
                method: "GET",
                url: "/api/users",
                statusCode: 200,
                responseTime: 150,
                userAgent: "Mozilla/5.0",
                ip: "127.0.0.1",
                userId: 1,
                timestamp: new Date(),
            };

            loggerService.logRequest(logEntry);

            expect(mockLogger.info).toHaveBeenCalledWith('API Request', logEntry);
        });
    });

    describe("logError", () => {
        it("should log error with context", () => {
            const error = new Error("Test error");
            const context = { userId: 1, endpoint: "/api/users" };

            loggerService.logError(error, context);

            expect(mockLogger.error).toHaveBeenCalledWith('API Error', {
                message: error.message,
                stack: error.stack,
                context,
            });
        });

        it("should log error without context", () => {
            const error = new Error("Test error");

            loggerService.logError(error);

            expect(mockLogger.error).toHaveBeenCalledWith('API Error', {
                message: error.message,
                stack: error.stack,
                context: undefined,
            });
        });
    });

    describe("logInfo", () => {
        it("should log info message with metadata", () => {
            const message = "User created successfully";
            const meta = { userId: 1 };

            loggerService.logInfo(message, meta);

            expect(mockLogger.info).toHaveBeenCalledWith(message, meta);
        });

        it("should log info message without metadata", () => {
            const message = "Application started";

            loggerService.logInfo(message);

            expect(mockLogger.info).toHaveBeenCalledWith(message, undefined);
        });
    });

    describe("logWarning", () => {
        it("should log warning message with metadata", () => {
            const message = "Deprecated API endpoint used";
            const meta = { endpoint: "/api/old-users" };

            loggerService.logWarning(message, meta);

            expect(mockLogger.warn).toHaveBeenCalledWith(message, meta);
        });

        it("should log warning message without metadata", () => {
            const message = "High memory usage detected";

            loggerService.logWarning(message);

            expect(mockLogger.warn).toHaveBeenCalledWith(message, undefined);
        });
    });

    describe("logDebug", () => {
        it("should log debug message with metadata", () => {
            const message = "Database query executed";
            const meta = { query: "SELECT * FROM users", duration: 45 };

            loggerService.logDebug(message, meta);

            expect(mockLogger.debug).toHaveBeenCalledWith(message, meta);
        });

        it("should log debug message without metadata", () => {
            const message = "Cache miss occurred";

            loggerService.logDebug(message);

            expect(mockLogger.debug).toHaveBeenCalledWith(message, undefined);
        });
    });
});

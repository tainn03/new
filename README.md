# Next.js API with TypeScript

A comprehensive Next.js API implementation using the page router with middleware for logging, authentication, and error handling. Includes complete unit tests for all components.

## Features

- **Next.js Page Router API**: RESTful API endpoints with proper routing
- **Authentication Middleware**: JWT-based authentication system
- **Logging Middleware**: Winston-based request/response logging
- **Error Handling Middleware**: Centralized error handling with proper status codes
- **Comprehensive Testing**: Unit tests for all services, middleware, and API endpoints
- **TypeScript**: Fully typed codebase with strict type checking
- **Database Integration**: TypeORM with SQLite for data persistence

## Project Structure

```
src/
├── pages/
│   ├── api/
│   │   ├── login/
│   │   │   └── index.ts          # Login endpoint
│   │   ├── register/
│   │   │   └── index.ts          # User registration endpoint
│   │   ├── users/
│   │   │   └── index.ts          # Users listing endpoint
│   │   └── profile/
│   │       └── index.ts          # User profile endpoint
│   └── index.tsx                 # Demo login page
├── middleware/
│   ├── auth.middleware.ts        # JWT authentication middleware
│   ├── logging.middleware.ts     # Request/response logging middleware
│   ├── error.middleware.ts       # Error handling middleware
│   └── index.ts                  # Middleware composer
├── services/
│   ├── auth.service.ts           # Authentication service
│   ├── logger.service.ts         # Logging service
│   └── user.service.ts           # User business logic
├── types/
│   └── api.types.ts              # API type definitions
├── entities/
│   └── user.entity.ts            # User entity
├── repository/
│   └── user.repository.ts        # User data access layer
└── __tests__/                    # Comprehensive test suite
    ├── auth.service.test.ts
    ├── logger.service.test.ts
    ├── user.service.new.test.ts
    ├── auth.middleware.test.ts
    ├── error.middleware.test.ts
    └── login.api.test.ts
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Protected Endpoints (require authentication)
- `GET /api/profile` - Get current user profile
- `GET /api/users` - Get all users

## Middleware Chain

Each API endpoint uses a combination of middleware:

1. **Method Validation**: Ensures only allowed HTTP methods are used
2. **Error Handling**: Catches and formats errors with appropriate status codes
3. **Authentication**: Validates JWT tokens for protected routes
4. **Logging**: Records request/response details

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env.local` with:
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   NODE_ENV=development
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

5. **Run tests with coverage:**
   ```bash
   npm run test:coverage
   ```

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

### Access protected endpoint
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing

The project includes comprehensive unit tests covering:

- **Services**: Authentication, logging, and user services
- **Middleware**: Auth, error handling, and logging middleware
- **API Endpoints**: All API routes with various scenarios
- **Edge Cases**: Error handling, validation, and security scenarios

### Test Coverage Areas

1. **Auth Service Tests**:
   - Password hashing and comparison
   - JWT token generation and verification
   - Token extraction from headers

2. **User Service Tests**:
   - User creation and validation
   - Authentication flow
   - CRUD operations

3. **Middleware Tests**:
   - Authentication flow
   - Error handling with proper status codes
   - Request/response logging

4. **API Endpoint Tests**:
   - Successful requests
   - Validation errors
   - Authentication failures
   - Method not allowed errors

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Zod schema validation for all inputs
- **Error Sanitization**: Production-safe error messages
- **CORS Ready**: Can be easily configured for cross-origin requests

## Middleware Features

### Logging Middleware
- Unique request IDs for tracing
- Response time tracking
- User context in logs
- Structured logging with Winston

### Auth Middleware
- JWT token validation
- User context injection
- Proper error responses
- Token extraction utilities

### Error Middleware
- Centralized error handling
- Status code mapping
- Production-safe error messages
- Structured error logging

## Database Schema

The application uses a simple User entity:

```typescript
interface User {
  id: number;
  email: string;     // unique
  name: string;
  password: string;  // hashed
}
```

## Development Notes

- Uses TypeScript strict mode for better type safety
- Follows RESTful API conventions
- Implements proper HTTP status codes
- Uses environment variables for configuration
- Includes request/response logging for debugging
- Comprehensive error handling at all levels

## Production Considerations

Before deploying to production:

1. Change the JWT secret in environment variables
2. Use a production database (PostgreSQL, MySQL, etc.)
3. Configure proper CORS settings
4. Set up proper logging infrastructure
5. Implement rate limiting
6. Add request size limits
7. Configure HTTPS
8. Set up proper monitoring and alerting

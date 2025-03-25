# EventZen Authentication System

This document provides an overview of the authentication system implemented in the EventZen application.

## Authentication Flow

The EventZen application uses JWT (JSON Web Token) based authentication. The flow is as follows:

1. User registers with email, password, and personal details
2. User logs in with email and password
3. Server validates credentials and returns a JWT token
4. Client stores the token and includes it in the Authorization header of subsequent requests
5. Server validates the token for each secured endpoint

## Components

The authentication system consists of the following key components:

### Models

- `User`: Implements Spring Security's UserDetails interface for authentication

### Repositories

- `UserRepository`: MongoDB repository for user data access

### Services

- `UserService`: Implements UserDetailsService for user management and authentication
- `JwtService`: Handles JWT token generation, validation, and parsing

### Security

- `JwtAuthenticationFilter`: Filter that intercepts requests to validate JWT tokens
- `SecurityConfig`: Configuration for Spring Security with JWT setup
- `ApplicationConfig`: Beans for authentication components like PasswordEncoder

### Controllers

- `AuthController`: Endpoints for user registration and login
- `UserController`: User management endpoints (with proper authorization)

## Authentication Endpoints

### Register

```
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "60f7a9b0e0a6f13c0c8b4567",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ATTENDEE"
}
```

### Login

```
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "60f7a9b0e0a6f13c0c8b4567",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ATTENDEE"
}
```

## Security Configuration

The application has been configured with the following security settings:

- JWT token expiration: 24 hours (configurable in application.yml)
- Password storage: BCrypt encoding
- Method-level security with @PreAuthorize annotations
- CORS enabled for frontend access
- Public endpoints: auth/_, events/public/_, vendors/public/\*, and Swagger documentation

## Testing Authentication

The authentication system has been tested with:

1. Unit tests for controllers
2. Integration tests for the full authentication flow
3. Manual testing with API clients

## Default Admin User

For development and testing purposes, a default admin user is created when the application starts if no users exist in the database:

- Email: admin@eventzen.com
- Password: admin123

**Important**: It is recommended to change this password after the first login in a production environment.

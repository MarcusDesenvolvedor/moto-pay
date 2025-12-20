# Authentication Feature

## Purpose

This feature handles user authentication and session management for the Driver & Motorcycle Rider Management App.

## Main Use Cases

1. **User Registration (Sign Up)**
   - User provides email, password, and full name
   - System validates input and creates user account
   - User is automatically logged in after registration

2. **User Login**
   - User provides email and password
   - System validates credentials
   - System returns access token and refresh token

3. **Token Refresh**
   - User provides refresh token
   - System validates refresh token
   - System returns new access token

4. **User Logout**
   - User requests logout
   - System revokes refresh token
   - User session is terminated

## API Endpoints

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user (revoke refresh token)
- `GET /auth/me` - Get current authenticated user

## Entities Used

- **User** (from User Aggregate)
  - id, email, passwordHash, fullName, isActive, createdAt, updatedAt, deletedAt

- **RefreshToken**
  - id, userId, token, expiresAt, revoked, createdAt

## Business Rules

- Email must be unique across all users
- Password must be hashed before storage (never store plain text)
- User must be active to login
- Refresh tokens must expire and can be revoked
- Access tokens have short expiration
- Refresh tokens have longer expiration
- Deleted users (soft delete) cannot authenticate

## UI Flows

1. **Login Screen**
   - Email input
   - Password input
   - Login button
   - Link to signup screen

2. **Signup Screen**
   - Full name input
   - Email input
   - Password input
   - Confirm password input
   - Signup button
   - Link to login screen

3. **Post-Authentication**
   - Redirect to main app
   - Store tokens securely
   - Set up authenticated API client

## Special Rules

- All authentication endpoints are public (no auth required)
- `/auth/me` requires authentication
- Tokens must be stored securely on client
- Password recovery is a future feature (not implemented in v1)


# 🔐 Token Lifecycle & Refresh Flow

## Overview

The authentication system uses a secure token-based approach with:
- **Access Tokens**: Short-lived (15 minutes) for API requests
- **Refresh Tokens**: Long-lived (30 days) stored securely, used only for refreshing access tokens

## Token Lifecycle

### 1. Login/Signup
- User provides credentials
- Backend validates and generates:
  - Access token (JWT, expires in 15 minutes)
  - Refresh token (random UUID, expires in 30 days, hashed before storage)
- Tokens returned to frontend
- Frontend stores:
  - Access token: In memory/state (via Zustand)
  - Refresh token: In Expo SecureStore (encrypted storage)

### 2. API Requests
- Access token attached to `Authorization: Bearer <token>` header
- Backend validates token via JWT strategy
- If token expired → 401 Unauthorized

### 3. Auto-Refresh Flow
When API returns 401:
1. Frontend interceptor catches the error
2. Checks if refresh token exists
3. Calls `POST /auth/refresh` with refresh token
4. Backend:
   - Validates refresh token (compares with hashed versions in DB)
   - Checks if token is valid and not revoked
   - Generates new access token (refresh token remains unchanged)
   - Returns new access token
5. Frontend:
   - Saves new access token to SecureStore
   - Updates token in state
   - Retries original request with new token
   - Queues any concurrent requests during refresh

### 4. Logout
- Frontend calls `POST /auth/logout` with refresh token
- Backend revokes refresh token (marks as revoked in DB)
- Frontend clears all tokens from SecureStore
- User redirected to login

## Security Features

### Refresh Token Security
- **Hashed Storage**: Refresh tokens are hashed with bcrypt before storing in database
- **Comparison**: Uses `bcrypt.compare()` to validate tokens (one-way comparison)
- **Revocation**: Tokens can be revoked (marked as revoked, not deleted)
- **Expiration**: Tokens expire after 30 days (configurable via `JWT_REFRESH_EXPIRES_DAYS`)

### Access Token Security
- **Short-lived**: Expires in 15 minutes (configurable via `JWT_ACCESS_EXPIRES_IN`)
- **JWT-based**: Signed with secret key
- **Bearer Token**: Sent in Authorization header
- **No Storage in DB**: Access tokens are stateless (JWT)

## Error Handling

### Refresh Token Invalid/Expired
- Frontend clears all tokens
- User redirected to login screen
- No automatic retry

### Network Errors During Refresh
- Original request fails
- User may need to retry manually
- Tokens remain valid if refresh failed due to network

### Concurrent Requests
- First 401 triggers refresh
- Other requests are queued
- All requests retry after refresh completes
- Prevents multiple refresh calls

## Configuration

### Environment Variables

**Backend:**
- `JWT_SECRET`: Secret key for signing tokens
- `JWT_ACCESS_EXPIRES_IN`: Access token expiration (default: "15m")
- `JWT_REFRESH_EXPIRES_DAYS`: Refresh token expiration in days (default: 30)

**Frontend:**
- `EXPO_PUBLIC_API_URL`: API base URL

## API Endpoints

### POST /auth/login
Returns both access and refresh tokens.

### POST /auth/refresh
**Request:**
```json
{
  "refreshToken": "uuid-uuid"
}
```

**Response:**
```json
{
  "data": {
    "accessToken": "jwt-token"
  }
}
```

**Note**: Only returns new access token, refresh token remains the same.

### POST /auth/logout
**Request:**
```json
{
  "refreshToken": "uuid-uuid"
}
```

Revokes the refresh token.

## Frontend Implementation

### Token Storage
- **Access Token**: Zustand store (in-memory) + SecureStore (persistence)
- **Refresh Token**: SecureStore only (never in memory/state for security)

### Auto-Refresh Interceptor
Located in `shared/api/api-client.ts`:
- Intercepts 401 responses
- Automatically calls refresh endpoint
- Updates token and retries request
- Queues concurrent requests

### State Management
- Zustand store manages authentication state
- Syncs with SecureStore on app initialization
- Updates state when tokens change

## Best Practices

1. **Never log tokens**: Access or refresh tokens should never appear in logs
2. **Secure storage**: Always use SecureStore for refresh tokens
3. **Token rotation**: Consider rotating refresh tokens on each use (future enhancement)
4. **Revocation**: Always revoke tokens on logout
5. **Expiration**: Keep access tokens short-lived for security

## Future Enhancements

- Token rotation (new refresh token on each refresh)
- Device tracking (limit tokens per device)
- Refresh token refresh (extend expiration on use)
- Rate limiting on refresh endpoint


# 🔐 Security Feature

## Purpose

The Security screen centralizes all security-related actions for user accounts, providing a single place to manage password, sessions, and account security settings.

## User Flow

1. User navigates to Profile → Security
2. User can:
   - Change password
   - View active sessions/devices
   - Logout from specific sessions
   - Logout from all sessions
   - View account email (read-only)
   - Logout from current session

## Screen Sections

### 🔑 Password Section
- **Action**: "Change Password" button
- **Flow**: Opens modal with form
- **Form Fields**:
  - Current password (required)
  - New password (required, min length)
  - Confirm new password (required, must match)
- **Validation**: Zod schema with real-time validation
- **Success**: Shows success message, closes modal, resets form
- **Error**: Shows error message with details

### 📱 Sessions Section
- **Display**: List of active sessions
  - Platform (mobile/web)
  - Last activity timestamp
  - Current session indicator
- **Actions**:
  - "Logout" button for each session (except current)
  - "Logout from all sessions" button
- **Behavior**:
  - Logout from specific session revokes that refresh token
  - Logout from all revokes all user's refresh tokens
  - After logout, user must login again

### 🚪 Logout Section
- **Action**: "Logout" button
- **Behavior**:
  - Calls `POST /auth/logout` with current refresh token
  - Clears all tokens from SecureStore
  - Clears React Query cache
  - Redirects to login screen

### 📧 Account Info Section
- **Display**: 
  - Email (read-only)
  - Security notice about email usage
- **Purpose**: Inform user about account recovery

## API Contracts

### PUT /auth/change-password
**Request:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "data": {
    "message": "Password changed successfully"
  }
}
```

**Rules:**
- User must be authenticated
- Validates current password
- Hashes and stores new password
- Invalidates all refresh tokens (forces re-login on all devices)

### GET /auth/sessions
**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "platform": "mobile" | "web",
      "lastActivity": "ISO8601",
      "isCurrent": boolean
    }
  ]
}
```

**Rules:**
- Returns only active (non-revoked, non-expired) sessions
- Includes current session indicator
- Sorted by last activity (most recent first)

### DELETE /auth/sessions
**Response:**
```json
{
  "data": {
    "message": "All sessions logged out successfully"
  }
}
```

**Rules:**
- Revokes all refresh tokens for the user
- User must login again on all devices

### DELETE /auth/sessions/:sessionId
**Response:**
```json
{
  "data": {
    "message": "Session logged out successfully"
  }
}
```

**Rules:**
- Revokes specific refresh token
- Cannot revoke current session (must use logout endpoint)
- User must login again on that device

### POST /auth/logout
**Request:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "data": {
    "message": "Logged out successfully"
  }
}
```

**Rules:**
- Revokes current refresh token
- Clears tokens on frontend
- Redirects to login

## Security Considerations

### Password Change
- Current password must be verified
- New password must meet minimum requirements
- All refresh tokens invalidated after password change (security best practice)
- Password is hashed with bcrypt before storage

### Session Management
- Refresh tokens are hashed before storage
- Only active (non-revoked, non-expired) tokens are shown
- Current session cannot be revoked via session management (use logout)
- Platform detection based on user agent or device info

### Token Invalidation
- Password change invalidates all tokens
- Session logout revokes specific token
- All sessions logout revokes all tokens
- Revoked tokens cannot be used for refresh

## Edge Cases

1. **No active sessions**: Show empty state message
2. **Password change fails**: Show specific error (wrong current password, weak new password)
3. **Session logout fails**: Show error, keep session visible
4. **Network error**: Show retry option
5. **Token expired during operation**: Redirect to login

## UI/UX Guidelines

- Black background with yellow accents
- Sectioned layout with clear hierarchy
- Loading states for all async operations
- Success/error feedback with alerts
- Modal for password change (non-blocking)
- Confirmation dialogs for destructive actions

## Integration Notes

- Removed password change from Edit Profile screen
- All security actions centralized here
- Reuses existing authentication infrastructure
- Follows existing design system and patterns







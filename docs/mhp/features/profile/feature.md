# 🎯 Feature: User Profile Screen

## Purpose

Provide a standard profile screen that allows users to view their profile information, manage avatar image, and access common account actions. This screen follows modern app design patterns similar to Instagram and Nubank.

## Main Use Cases

1. **View Profile**: User can see their profile information (name, email, account creation date)
2. **View Avatar**: User can view their profile picture in full-screen (read-only)
3. **Edit Profile**: Access to edit basic profile data including avatar
4. **Manage Companies**: View and manage user's companies
5. **Manage Vehicles**: View and manage user's vehicles
6. **Security**: Access to change password and security settings
7. **Logout**: Securely log out from the application

## User Flow

1. User navigates to "Profile" tab
2. Screen displays:
   - Profile avatar (circular, with placeholder if no image)
   - User name (bold)
   - Email or subtitle
   - List of profile options
3. User can tap avatar to view in full-screen (read-only, no editing)
4. User can tap any option to navigate to respective screen
5. User can tap "Logout" to securely log out

## API Endpoints

### GET /auth/me
Fetches current user information (already exists).

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "User Name",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST /auth/logout
Logs out the user (already exists).

**Request:**
```json
{
  "refreshToken": "token"
}
```

## UI Sections

### Profile Header
- **Avatar**: Circular image, 120x120px, clickable (read-only)
  - Default placeholder icon if no image
  - Tap to open full-screen image viewer (view only, no editing)
  - No camera or edit icons shown
  - Clearly indicates "view only" behavior
- **User Name**: Bold typography, h2 size
- **Subtitle**: Email or "MotoPay User"

### Profile Options List
Each item displays:
- Icon (left)
- Label (center)
- Chevron indicator (right)
- Touchable row

Options:
1. **Edit Profile** - Navigate to edit screen (future)
2. **My Companies** - View user's companies (future)
3. **My Vehicles** - View user's vehicles (future)
4. **Security** - Change password and security (future)
5. **Terms & Privacy** - Legal information (future)
6. **Logout** - Log out from app (implemented)

### Profile Data (Read-only)
- Email address
- Account creation date (formatted)

## Avatar Interaction Rules

### Profile Screen (Read-Only)
- Avatar is **READ-ONLY** on the Profile screen
- On tap: Opens full-screen image viewer modal
- User can ONLY view the image (zoom and close actions)
- NO edit, upload, or change action available
- No camera or edit icons displayed
- Avatar should be clearly non-editable

### Edit Profile Screen (Editable)
- Avatar IS editable in Edit Profile screen
- Allows:
  - Select new image from gallery
  - Crop/resize if needed
  - Upload and update profile image
- Shows camera/edit icon badge
- Applies image size and compression limits
- Updates user profile on success

## Image Handling

### Avatar Upload Requirements (Edit Profile Only)
- Use Expo ImagePicker
- Max dimensions: 512x512px
- Max file size: ~200KB after compression
- Format: JPEG with quality compression
- Resize before upload
- Store only optimized image URL on backend

### Compression Strategy
1. Pick image from gallery/camera
2. Resize to max 512x512px (maintain aspect ratio)
3. Compress JPEG quality to ~0.7-0.8
4. Check file size, reduce quality if needed
5. Upload to backend
6. Store URL in user profile

## Logout Behavior

When user taps "Logout":
1. Call POST /auth/logout with refresh token
2. Clear access token from storage
3. Clear refresh token from storage
4. Reset React Query cache
5. Navigate to login screen

## Security Considerations

- Avatar images are validated before upload
- File size limits prevent abuse
- Tokens are securely stored and cleared on logout
- User data is fetched only when authenticated
- Profile data is cached with React Query

## Design Guidelines

- **Background**: Black (#0B0B0F)
- **Primary Color**: Yellow (#FBBF24) for accents
- **Purple**: Used for icons and highlights (#A855F7)
- **Text**: White for primary, gray for secondary
- **Cards**: Rounded corners, soft shadows
- **Spacing**: Consistent using theme spacing
- **Touch Targets**: Minimum 44x44px

## Integration Notes

- Uses existing `/auth/me` endpoint
- Uses existing `/auth/logout` endpoint
- Integrates with AuthContext for user state
- Uses token-storage utilities for logout
- Follows existing navigation patterns

## Component Architecture

### ProfileAvatarView
- **Purpose**: Read-only avatar display for Profile screen
- **Location**: `docs/mhp/features/profile/frontend/components/ProfileAvatarView.tsx`
- **Behavior**: Opens full-screen image viewer on tap
- **Props**: `imageUri`, `size`
- **No editing capabilities**

### ProfileAvatarEdit
- **Purpose**: Editable avatar for Edit Profile screen
- **Location**: `docs/mhp/features/profile/frontend/components/ProfileAvatarEdit.tsx`
- **Behavior**: Opens image picker on tap, allows selection and upload
- **Props**: `imageUri`, `onImageSelected`, `size`
- **Full editing capabilities**

## Future Enhancements

- Upload avatar to backend (requires backend endpoint)
- View and manage companies
- View and manage vehicles
- Terms and privacy screens



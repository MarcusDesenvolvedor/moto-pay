# 🎯 Feature: Edit Profile

## Purpose

Allow authenticated users to edit their basic profile information, including name and profile avatar. This screen provides a clean, user-friendly interface for profile management.

## Main Use Cases

1. **Edit Name**: User can update their full name
2. **View Email**: User can see their email (read-only, cannot be changed)
3. **Update Avatar**: User can change their profile picture with automatic compression (ONLY place where avatar editing is allowed)
4. **Save Changes**: User can save profile updates with validation

## Avatar Editing Rules

- **This is the ONLY screen where avatar editing is allowed**
- Profile screen avatar is read-only (opens image viewer only)
- Avatar editing must happen explicitly in Edit Profile context
- Clear visual indicators (camera icon badge) show editing is available

## User Flow

1. User navigates from Profile screen → taps "Edit Profile"
2. Screen loads current user data
3. Form displays:
   - Current avatar (editable)
   - Name field (pre-filled, editable)
   - Email field (read-only)
4. User can:
   - Tap avatar to change photo
   - Edit name field
   - View email (cannot edit)
5. User taps "Save"
6. System validates input
7. System saves changes
8. System shows success feedback
9. User is navigated back to Profile screen
10. Profile screen shows updated data

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

### PUT /auth/me
Updates current user profile.

**Request:**
```json
{
  "fullName": "Updated Name"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Updated Name",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## Form Fields

### Name (REQUIRED)
- Type: Text input
- Pre-filled with current user.fullName
- Validation: string().min(1) via Zod
- Required

### Email (READ-ONLY)
- Type: Display only / disabled input
- Shows current user.email
- Cannot be edited
- Validation: string().email() (for display)

### Avatar (OPTIONAL)
- Type: Image picker
- Current image displayed
- Clickable to change
- Max size: 512x512px
- Max file size: ~200KB
- Compression: JPEG quality 0.7-0.8

## Validation Rules

- Name: Required, minimum 1 character
- Email: Read-only, displayed for reference
- Avatar: Optional, validated on selection

## UI Description

### Screen Layout
- Black background (#0B0B0F)
- Yellow primary color (#FBBF24) for buttons and focus
- White text for content
- Yellow border on focused inputs
- Clean spacing and typography

### Components
1. **ProfileAvatarEdit**: Circular, 120x120px, clickable with edit badge (editable)
2. **Name Input**: Text input with label
3. **Email Display**: Disabled input or text field
4. **Save Button**: Sticky at bottom or clear CTA

### Component Usage
- Uses `ProfileAvatarEdit` component (not `ProfileAvatarView`)
- This is the explicit editing context for avatar changes
- All avatar mutations occur only in this screen

### UX Behavior
- Loading state while fetching user data
- Form pre-filled with current data
- Disable save button while submitting
- Success feedback on save
- Error handling with friendly messages
- Navigation back to Profile on success

## Avatar Handling

### Image Requirements
- Use Expo ImagePicker
- Max dimensions: 512x512px
- Max file size: ~200KB after compression
- Format: JPEG with quality compression
- Resize before upload

### Compression Strategy
1. Pick image from gallery
2. Resize to max 512x512px (maintain aspect ratio)
3. Compress JPEG quality to ~0.7-0.8
4. Check file size, reduce quality if needed
5. Store locally (upload to backend when endpoint available)

## Error Handling

- Network errors: Show friendly message, allow retry
- Validation errors: Show field-level errors
- API errors: Show clear error message
- Unauthorized: Redirect to login

## Integration Notes

- Uses existing GET /auth/me endpoint
- Creates new PUT /auth/me endpoint
- Integrates with React Query for caching
- Invalidates profile queries on success
- Follows existing navigation patterns

## Security Considerations

- User must be authenticated
- Only update allowed fields (fullName)
- Email cannot be changed
- Validate user ownership
- Handle API errors gracefully



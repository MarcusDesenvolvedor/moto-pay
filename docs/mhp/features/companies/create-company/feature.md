# 🎯 Feature: Create Company

## Purpose

Allow authenticated users to create a new company that will be used for transactions, reports, and financial tracking. When a user creates a company, they are automatically assigned the OWNER role.

## Main Use Cases

1. **Create Company**: User creates a new company with name and optional description
2. **Auto-assign Owner**: System automatically links user to company with OWNER role
3. **Company Management**: Created company becomes available for transactions, vehicles, and reports

## User Flow

1. User navigates to "Create Company" screen
2. User fills form:
   - Company Name (required)
   - Description (optional)
3. User taps "Criar Empresa"
4. System validates input
5. System creates company
6. System creates company_users record with role = 'OWNER'
7. System shows success feedback
8. User is navigated back or to company list

## API Endpoints

### POST /companies

Creates a new company and links the authenticated user as OWNER.

**Request:**
```json
{
  "name": "MotoPay Delivery",
  "description": "Delivery service company"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "MotoPay Delivery",
    "description": "Delivery service company",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## Form Fields

### Company Name (REQUIRED)
- Type: Text input
- Validation: string().min(1) via Zod
- Required
- Examples: "MotoPay Delivery", "Uber Moto", "Freelancer"

### Description (OPTIONAL)
- Type: Multiline text input
- Validation: optional string
- Optional

## Validation Rules

- Name: Required, minimum 1 character
- Description: Optional

## UI Description

### Screen Layout
- Black background (#0B0B0F)
- Yellow primary color (#FBBF24) for buttons and focus
- White text for content
- Yellow border on focused inputs
- Clean spacing and typography

### Components
1. **Name Input**: Text input with label
2. **Description Input**: Multiline text input with label
3. **Submit Button**: "Criar Empresa" button

### UX Behavior
- Loading state while submitting
- Disable submit button during request
- Success feedback on save
- Navigate back on success
- Error handling with friendly messages

## Database Impact

### Tables Affected

1. **companies**
   - New record created with:
     - id (UUID)
     - name (required)
     - document (null, optional)
     - createdAt, updatedAt (auto)
     - deletedAt (null)

2. **company_users**
   - New record created with:
     - id (UUID)
     - companyId (from created company)
     - userId (from authenticated user)
     - role = 'OWNER'
     - createdAt (auto)

## Roles & Permissions

- **OWNER**: User who created the company
  - Full access to company data
  - Can manage company settings
  - Can add/remove members (future feature)

## Business Rules

1. User must be authenticated
2. Company name is required
3. Description is optional
4. User is automatically assigned OWNER role
5. Company is immediately available for use
6. One user can create multiple companies

## Error Handling

- **400 Bad Request**: Invalid input (validation errors)
- **401 Unauthorized**: User not authenticated
- **500 Internal Server Error**: Database or system errors

Error responses include friendly messages for user feedback.

## Integration Notes

- Uses existing authentication system
- Integrates with company_users table
- Created company available for:
  - Transaction creation
  - Vehicle registration
  - Reports and analytics

## Security Considerations

- User must be authenticated
- Only authenticated user can create companies
- User automatically becomes OWNER
- Company data is isolated by company_id











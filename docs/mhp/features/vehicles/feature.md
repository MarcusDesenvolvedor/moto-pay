# 🎯 Feature: Vehicle Registration (Cadastro de Veículos)

## Purpose

Allow authenticated users to register vehicles that will later be selected when creating transactions. A vehicle represents the motorcycle or vehicle used by the driver.

## Main Use Cases

1. **Register Vehicle**: User creates a new vehicle with name, optional license plate, and optional notes
2. **List Vehicles**: User can view all vehicles they have access to (through company membership)
3. **Select Vehicle for Transaction**: Vehicles can be selected when creating financial transactions

## User Flow

1. User navigates to "Add Vehicle" screen
2. User enters vehicle name (required)
3. User optionally enters license plate
4. User optionally adds observation/notes
5. User submits form
6. System validates input
7. System creates vehicle linked to user's company
8. System shows success feedback
9. System resets form
10. Vehicle becomes available for selection in transactions

## API Endpoints

### POST /vehicles
Creates a new vehicle.

**Request:**
```json
{
  "name": "Moto Principal",
  "plate": "ABC-1234",
  "note": "Veículo principal de trabalho"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Moto Principal",
    "plate": "ABC-1234",
    "note": "Veículo principal de trabalho",
    "companyId": "uuid",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### GET /vehicles
Fetches all vehicles the authenticated user has access to (through company membership).

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Moto Principal",
      "plate": "ABC-1234",
      "note": "Veículo principal de trabalho",
      "companyId": "uuid",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Entities Used

- **Vehicle** (from data model)
  - Maps to `vehicles` table in database
  - Fields: id, companyId, name, plate (optional), note (optional), type, model, year, isActive, createdAt, updatedAt
  - For this feature, we use:
    - name: Required, from form input
    - plate: Optional, from form input
    - note: Optional, from form input
    - companyId: From user's company membership (validated)
    - type: Default to "motorcycle" (can be extended later)
    - isActive: Default to true

- **Company** (from data model)
  - Used to validate user belongs to company
  - Vehicles are scoped by company

## Business Rules

1. User must be authenticated
2. Vehicle must be linked to a company the user belongs to
3. Vehicle name is mandatory (min 1 character)
4. License plate is optional (no strict validation for now)
5. Notes/observations are optional
6. Vehicles are scoped by company (multi-tenancy)
7. Only active vehicles can be used in transactions (future feature)

## UI Description

### Screen Layout
- Black background (#0B0B0F)
- Yellow primary color (#FBBF24)
- White text for content
- Yellow border on focused inputs

### Form Fields
1. **Vehicle Name** (REQUIRED)
   - Text input
   - Examples: "Moto Principal", "CG 160", "XRE 300"
   - Required validation

2. **License Plate** (OPTIONAL)
   - Text input
   - No strict validation for now
   - Optional field

3. **Observation / Notes** (OPTIONAL)
   - Multiline text input
   - Optional field

### Components
- Input components with yellow border on focus
- Submit button: "Salvar Veículo" with loading state
- Success feedback after submission
- Error handling with clear messages

### Validation
- Name: Required, string().min(1) via Zod
- Plate: Optional string
- Note: Optional string

## Integration with Transactions

- Vehicles must be selectable when creating a transaction
- When creating a transaction:
  - User selects one of their vehicles (from companies they belong to)
  - VehicleId is saved in the transaction record
- GET /vehicles endpoint provides the list of vehicles for selection
- Only vehicles from companies the user belongs to are returned

## Edge Cases

1. **No Companies**: If user has no companies, show message and disable form
2. **Network Error**: Show error message, allow retry
3. **Validation Error**: Show field-level errors
4. **Unauthorized**: Redirect to login
5. **Company Access Denied**: Show error if company validation fails

## Special Rules

- All vehicles are scoped by company
- Vehicles are immediately available for selection in transactions
- Form resets after successful submission
- Loading state prevents multiple submissions
- Success feedback confirms vehicle creation


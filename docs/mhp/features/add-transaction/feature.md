# 🎯 Feature: Add Transaction (Gain / Expense)

## Purpose

Allow authenticated users to create financial transactions (gains or expenses) that are immediately reflected in daily reports. This feature enables users to track their income and expenses within their company context.

## Main Use Cases

1. **Create Gain Transaction**: User records income (e.g., delivery earnings, freight services)
2. **Create Expense Transaction**: User records expenses (e.g., fuel, maintenance, insurance)
3. **Link to Company**: All transactions must be associated with a company the user belongs to
4. **Mark as Paid**: Users can indicate if a transaction has been paid
5. **Add Notes**: Optional observation field for additional context

## User Flow

1. User navigates to "Add" tab
2. User selects transaction type (Ganho/Despesa) via toggle
3. User selects a company from dropdown (only companies they belong to)
4. User enters amount (BRL currency, masked input)
5. User toggles "Paid" status (optional, defaults to false)
6. User optionally adds observation/note
7. User submits form
8. System validates input
9. System creates transaction
10. System shows success feedback
11. System resets form
12. Reports are automatically updated (via React Query invalidation)

## API Endpoints

### POST /transactions
Creates a new transaction.

**Request:**
```json
{
  "type": "GAIN" | "EXPENSE",
  "companyId": "uuid",
  "amount": 100.50,
  "paid": true,
  "note": "Optional observation"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "type": "GAIN",
    "companyId": "uuid",
    "amount": 100.50,
    "paid": true,
    "note": "Optional observation",
    "recordDate": "2024-01-15",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### GET /companies
Fetches all companies the authenticated user belongs to.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Company Name",
      "document": "12345678900"
    }
  ]
}
```

## Entities Used

- **FinancialRecord** (from data model)
  - Maps to `financial_records` table in database
  - Fields: id, companyId, vehicleId (optional), type, category, amount, description, recordDate, status
  - For this feature, we use:
    - type: "GAIN" | "EXPENSE" (mapped from transaction type)
    - category: Default category based on type (can be extended later)
    - amount: From form input
    - description: From note field
    - recordDate: Current date
    - status: "ACTIVE"
    - companyId: From selected company
    - vehicleId: null (not used in this feature)

- **Company** (from data model)
  - Used to validate user belongs to company
  - Fetched via company_users relationship

## Business Rules

1. User must be authenticated
2. Transaction must be linked to a company the user belongs to
3. Amount must be positive (> 0)
4. Type must be either "GAIN" or "EXPENSE"
5. Company ownership validated via company_users table
6. Transaction is created with current date as recordDate
7. Status defaults to "ACTIVE"
8. Financial records are immutable (no hard delete)

## UI Description

### Screen Layout
- Black background (#0B0B0F)
- Yellow primary color (#FBBF24)
- White text for content
- Purple border on focused inputs

### Components
1. **Toggle/Segmented Control**: Switch between "Ganho" and "Despesa"
2. **Company Picker**: Dropdown showing user's companies
3. **Amount Input**: Currency masked input (R$ format)
4. **Paid Toggle**: Boolean switch with label "Pago"
5. **Note Input**: Optional text area
6. **Submit Button**: "Salvar" button with loading state

### Validation
- Type: Required, enum("GAIN", "EXPENSE")
- CompanyId: Required, UUID format
- Amount: Required, positive number
- Paid: Boolean (defaults to false)
- Note: Optional string

## Integration with Reports

- After successful transaction creation:
  - React Query invalidates reports queries
  - Daily summary automatically refreshes
  - Gains contribute to green/positive values
  - Expenses contribute to red/negative values
  - Reports aggregation includes new transaction

## Edge Cases

1. **No Companies**: If user has no companies, show message and disable form
2. **Network Error**: Show error message, allow retry
3. **Validation Error**: Show field-level errors
4. **Unauthorized**: Redirect to login
5. **Company Access Denied**: Show error if company validation fails

## Special Rules

- All transactions are scoped by company
- Transactions are immediately available in reports
- Form resets after successful submission
- Loading state prevents multiple submissions
- Success feedback confirms transaction creation


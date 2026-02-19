# Reports Feature

## Purpose

Provide financial reports with charts for income, expenses, and profit — always scoped by the selected company, respecting Business Logic and multi-tenancy.

## Main Use Cases

1. View daily summary (income and expenses of the day)
2. View evolution of income vs expenses by period (day, week, month)
3. View distribution by category (pie chart)
4. View distribution by vehicle (bar chart)
5. Filter reports by company, period, and optionally by vehicle (for category chart)

## API Endpoints

All endpoints require `companyId` as query parameter. User must belong to the company.

- `GET /reports/daily-summary?companyId=:id` — Income and expense for today
- `GET /reports/summary?companyId=:id&startDate=&endDate=` — Summary by date
- `GET /reports/by-category?companyId=:id&startDate=&endDate=&vehicleId=` — Breakdown by category
- `GET /reports/by-vehicle?companyId=:id&startDate=&endDate=` — Breakdown by vehicle

## UI Flow

### Navigation

- **Home tab** (first tab in bottom navigation) → `HomeReportsScreen`
- User lands on Reports when opening the app (Home tab)

### Screens

- **HomeReportsScreen**: Main reports screen with:
  - Company selector (chips)
  - Period selector (Today, Week, Month)
  - Vehicle filter (optional, for category chart)
  - Daily summary cards (Income today, Expenses today)
  - Profit today (when period = day)
  - Evolution chart (StackedBar: Income x Expenses per period)
  - Category chart (Pie: distribution by category)
  - Vehicle chart (Bar: profit per vehicle)

### Charts

1. **EvolutionChart** — Stacked bar chart showing income (green) and expenses (red) per date. Up to 10 most recent points.
2. **CategoryChart** — Pie chart showing distribution by category (income + expense per category). Top 8 categories.
3. **VehicleChart** — Bar chart showing profit per vehicle. Top 8 vehicles.

### Filters

- **Company**: Required. User selects one company. All data is scoped to that company.
- **Period**: Day (today), Week (current week), Month (current month). Affects all charts except daily summary (which is always today).
- **Vehicle**: Optional. When set, the category chart shows only transactions for that vehicle.

### States

- **Loading**: Skeleton/spinner during fetch
- **Empty**: "No data for the selected period" when no data
- **Error**: Message + "Try again" button
- **No company**: "Create or join a company to view reports"

## Entities Used

- FinancialRecord (income/expense)
- Vehicle
- Company
- CompanyUser (membership validation)

## Business Rules (from business-logic.md)

- Reports always reflect only data from the selected company
- Only ACTIVE financial records (status), not deleted
- profit = income - expenses
- No mixing of data across companies

## Dependencies

- react-native-chart-kit (charts)
- react-native-svg (peer of chart-kit)
- React Query (data fetching)
- shared: useCompanies, AnimatedCard, Loading

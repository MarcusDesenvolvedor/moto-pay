# 🧠 Business Logic
**Driver & Motorcycle Rider Management App**

This document defines the **business rules, behaviors, constraints, and responsibilities** of the system.

It is the **single source of truth** for how the product must behave. Any implementation that contradicts this document is considered incorrect.

---

## 🎯 1. System Purpose

The system enables **motorcycle riders and drivers** who generate income using vehicles to:

- Track earnings and expenses
- Manage vehicles
- Record mileage
- Operate as individuals or companies
- Generate reliable financial reports
- Evolve toward professional financial and operational management

---

## 👤 2. System Actors

### 2.1 User
A person who uses the application.

Logical types:
- Autonomous rider/driver
- Company owner
- Company member

### 2.2 Company
An organizational entity that groups users, vehicles, and financial records.

It may represent:
- MEI / sole proprietor
- Legal entity (PJ)
- Small fleet

---

## 🏢 3. Company Rules

- A user may belong to **zero or more companies**.
- Every company must have **at least one user with the OWNER role**.
- A user may belong to multiple companies simultaneously.
- Every operation involving vehicles or financial data must always occur **within the context of a company**.
- Data from different companies must **never be mixed or visible across boundaries**.

---

## 🚗 4. Vehicle Rules

- Every vehicle:
  - Belongs to **exactly one company**.
  - Has a type: motorcycle, car, or utility.
- A vehicle can be:
  - Active
  - Inactive
- Only active vehicles may:
  - Receive mileage records.
  - Be associated with financial records.
- Vehicles may only be reassigned by explicit administrative rules (future feature).

---

## 🛣️ 5. Mileage Rules

- Every mileage record:
  - Is associated with a vehicle and a company.
- Mileage can be recorded as:
  - Start/end values for a period, or
  - A single incremental value.
- The system must:
  - Automatically calculate driven distance when possible.
- It is not allowed to:
  - Record negative mileage.
  - Register values that reduce the accumulated total for a vehicle.
- Mileage data is used for:
  - Reports
  - Performance indicators
  - Cost-per-kilometer calculations (future)

---

## 💰 6. Financial Rules

### 6.1 Financial Record Types

- Income
- Expense

Every financial record must contain:
- Company
- (Optional) Vehicle
- Amount > 0
- Date
- Category
- Optional description

---

### 6.2 Income Rules

- Income represents any money inflow such as:
  - Delivery apps
  - Freight services
  - Rides
- Income:
  - May or may not be associated with a vehicle.
  - Must always belong to a company.

---

### 6.3 Expense Rules

Common categories:
- Fuel
- Maintenance
- Insurance
- Fines
- Food
- Other

Rules:
- Expenses may be associated with:
  - A vehicle, or
  - Only the company.
- An expense must never:
  - Have a negative value.
  - Be recorded under a company the user does not belong to.

---

### 6.4 Financial Immutability

- Financial records must:
  - **Not be physically deleted**.
  - Only be:
    - Edited, or
    - Marked as canceled.
- Historical integrity must be preserved for auditing purposes.

---

## 📊 7. Reporting Rules

The system must generate:

- Total income per period
- Total expenses per period
- Net profit:

```text
profit = income - expenses
```

Reports must be available by:
- Company
- Vehicle
- Category
- Period

Rules:
- Reports must always reflect:
  - Only data from the selected company.
- All values must be derived from base records.
- Users must never manually override calculated values.

---

## 🔐 8. User and Access Rules

- A user must be authenticated to perform any operation.
- Basic roles:
  - OWNER
  - MEMBER
- OWNER permissions:
  - Manage company settings.
  - Invite and remove users.
- MEMBER permissions:
  - Register data.
  - View reports.
- Users may only:
  - View and modify data belonging to companies they are members of.

---

## 🧾 9. Consistency and Validation Rules

The system must ensure:

- No financial record exists without a company.
- No mileage record exists without a valid vehicle.
- No vehicle exists without a company.
- No orphaned data is allowed.
- Dates must not be in the future unless explicitly allowed.
- Monetary values must always be positive.

---

## 🔄 10. System Evolution Rules

The system must support future evolution, including:

- Integrations with:
  - Banks
  - Delivery platforms
- Automatic tax calculations
- Financial goals
- Advanced fleet management
- Fiscal and compliance reports

Such evolutions must **not violate or break existing business rules**.

---

## 🚫 11. Forbidden Behaviors

The system must never:

- Mix data across different companies.
- Allow unauthenticated access.
- Expose financial data of other users.
- Permanently delete financial history.
- Allow inconsistent or orphaned records.

---

## ✅ 12. Final Principle

> Every business rule must be implemented such that:  
> **If the code contradicts this document, the code is wrong.**

---

**Status:** Active  
**Type:** Business Source of Truth  
**Version:** 1.0

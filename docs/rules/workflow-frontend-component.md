# 🔄 Workflow — Frontend Development
**Driver & Motorcycle Rider Management App**

This document defines the **workflow and rules** for developing frontend code using **React Native + TypeScript**.

It must be followed whenever creating or modifying screens, components, hooks, or client-side logic.

---

## 🎯 1. Purpose

Ensure that the frontend:

- Reflects the Business Logic and Features
- Respects Architecture boundaries
- Follows Coding Rules
- Is consistent, maintainable, and testable
- Integrates safely with the API

---

## 🧱 2. Technology Context

This workflow assumes:

- React Native
- TypeScript
- React Query for server state
- Axios or fetch for HTTP
- Zod (or equivalent) for client-side schemas
- React Navigation for routing

---

## 📌 3. Before Writing UI Code

Before implementing any UI, ensure you have:

- The **feature.md** describing the feature
- Access to:
  - Business Logic
  - Data Model
  - Architecture
  - Coding Rules
  - Workflow API

❗ Never design UI or state flows without a feature context.

---

## 📁 4. Frontend Folder Organization

Follow the structure defined in **architecture.md**.

General rules:

- Feature-specific UI goes inside its feature folder
- Shared UI goes to shared/ui
- Hooks go to shared/hooks or feature/hooks
- API clients go to shared/api
- No cross-feature imports except through shared layers

---

## 🛠️ 5. Frontend Creation Steps

For each feature, follow these steps:

### Step 1 — Identify UI Flows

- List screens and main user actions
- Define navigation paths
- Map actions to API endpoints

---

### Step 2 — Define Types & Schemas

- Define TypeScript types for:
  - API responses
  - View models
- Use Zod schemas to:
  - Validate API responses
  - Validate form inputs

---

### Step 3 — Implement API Hooks

- Create hooks using React Query:
  - `useQuery` for reads
  - `useMutation` for writes
- Hooks must:
  - Encapsulate API calls
  - Handle loading and error states
  - Expose typed results

Example:
```
useGetVehicles(companyId)
useCreateExpense()
```

---

### Step 4 — Implement Screens

Screens must:

- Orchestrate hooks
- Handle navigation
- Pass data to components
- Not contain business logic

---

### Step 5 — Implement Components

Components must:

- Be presentational
- Receive data via props
- Have no direct API calls
- Be reusable when possible

---

### Step 6 — Manage Local State

- Use local state only for:
  - UI interactions
  - Temporary form values
- Never duplicate server state locally

---

### Step 7 — Handle Errors & Loading

- Always show:
  - Loading indicators
  - User-friendly error messages
- Never expose raw API errors

---

### Step 8 — Secure Data Access

- Never render data unless:
  - User is authenticated
  - Company context is selected
- Always respect role-based UI restrictions

---

## ⚙️ 6. State Management Rules

- Server state:
  - Must be managed by React Query
- UI state:
  - Must be local to screens/components
- No global state unless justified

---

## 🔐 7. Authentication Flow

Frontend must:

- Store tokens securely
- Attach tokens to every API request
- Handle:
  - Expired sessions
  - Automatic logout
- Redirect unauthenticated users to login

---

## 🧾 8. Forms & Validation

- All forms must:
  - Validate inputs before submit
  - Show field-level errors
- Never send invalid data to API

---

## 📄 9. UI Feedback Standards

Every action must provide feedback:

- Success → confirmation/toast
- Error → clear message
- Loading → spinner/skeleton

---

## ❌ 10. Forbidden Practices

- API calls inside components
- Business logic in UI
- Using `any`
- Ignoring typing of API responses
- Duplicating server state
- Hardcoding business rules in UI

---

## 🧪 11. Testing Workflow

For frontend code:

- Test:
  - Hooks logic
  - Critical screens
- Prefer:
  - Unit tests for hooks
  - Integration tests for flows

---

## ✅ 12. Final Checklist

Before considering a frontend feature done:

- [ ] API hooks created and typed
- [ ] Screens orchestrate logic only
- [ ] Components are presentational
- [ ] Loading and errors handled
- [ ] Auth respected
- [ ] Lint passes
- [ ] Feature.md fully covered

---

## 🏁 13. Final Principle

> The frontend is a reflection of business capabilities, not a place for business decisions.

---

**Status:** Active  
**Type:** Frontend Development Workflow  
**Version:** 1.0


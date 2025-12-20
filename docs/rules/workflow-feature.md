# 🔄 Workflow — Feature Development
**Driver & Motorcycle Rider Management App**

This document defines the **workflow and rules** to create, describe, and implement application features.

It must be followed whenever a new feature is added or an existing one is modified.

---

## 🎯 1. Purpose

Ensure that every feature:

- Is derived from Business Logic
- Uses the Data Model correctly
- Respects Architecture boundaries
- Follows Coding Rules
- Can be developed independently and iteratively

---

## 🧱 2. What Is a Feature

A **feature** represents a coherent business capability of the system, for example:

- Authentication
- Company management
- Vehicle management
- Financial records
- Mileage tracking
- Dashboard reports

A feature must:
- Solve a single business problem
- Own its use cases
- Contain backend and frontend concerns when applicable

---

## 📁 3. Feature Folder Structure

All features must be created under a root folder named:

```
/features
```

Each feature must have its own folder:

```
/features/{feature-name}
```

Inside each feature folder:

```
/features/{feature-name}
  ├── feature.md
  ├── backend/
  └── frontend/
```

Rules:
- Feature name must be kebab-case
- One folder per feature
- No cross-feature imports except through shared/core layers

---

## 📄 4. The feature.md File

Every feature must contain a **feature.md** file that describes the feature at a high level.

It must include:

- Purpose
- Main use cases
- API endpoints involved
- Entities used
- UI flows
- Special rules or constraints

The feature.md is the **primary input** when asking the AI to generate code for that feature.

---

## 🛠️ 5. Creating a New Feature — Steps

### Step 1 — Identify the Feature

- Derive it from:
  - Business Logic
  - Requirements
- Ensure the scope is clear and limited

---

### Step 2 — Create the Feature Folder

- Create `/features/{feature-name}`
- Add an empty `feature.md`

---

### Step 3 — Write feature.md

The feature.md must:

- Describe the feature at high level
- Not duplicate full business logic
- Reference:
  - Business rules
  - Data Model entities

---

### Step 4 — Review Against Rules

Before implementation, ensure:

- It aligns with Business Logic
- It fits Architecture layers
- It respects Coding Rules

---

### Step 5 — Ask AI to Implement

When generating code, always provide:

- architecture.md
- coding-rules.md
- workflow-api.md
- workflow-frontend.md
- This workflow document
- The specific `feature.md`

And explicitly instruct:

> "Implement this feature strictly following all provided documents."

---

## ⚙️ 6. Implementing the Feature

The AI must:

- Generate code for:
  - Backend (NestJS)
  - Frontend (React Native)
- Follow the API workflow for endpoints
- Follow frontend workflow for UI
- Respect domain and repository boundaries

Implementation must be done:
- Feature by feature
- Never across multiple features at once

---

## 🧪 7. Feature Validation

After generation, ensure:

- All use cases are covered
- Business rules are enforced
- Code compiles and passes lint
- No architecture violations exist

---

## ❌ 8. Forbidden Practices

- Mixing responsibilities of multiple features
- Writing code without a feature.md
- Adding logic not described in feature.md
- Skipping reference to Business Logic
- Creating shared code inside feature folders

---

## 📌 9. Feature Lifecycle

Each feature goes through:

1. Identified from Business Logic
2. Described in feature.md
3. Implemented
4. Reviewed
5. Stabilized

Once stabilized:
- The feature.md becomes historical
- The code becomes the source for that feature

---

## 🏁 10. Final Principle

> No code exists without a feature.  
> No feature exists without a clear business purpose.

---

**Status:** Active  
**Type:** Feature Development Workflow  
**Version:** 1.0

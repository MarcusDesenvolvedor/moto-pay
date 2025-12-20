# 🗂️ Data Model
**Driver & Motorcycle Rider Management App**

This document defines the **domain data model** of the system based on:
- Requirements v1.0
- Business Logic v1.0
- Database Schema (`db-schema.sql`)

It describes **entities, attributes, relationships, and aggregates**. This model is technology-agnostic and represents the conceptual structure of the domain.

---

## 🎯 1. Purpose

The data model aims to:

- Represent all core business concepts
- Define ownership and boundaries between entities
- Guide ORM/entities creation in backend
- Support feature design and API contracts

---

## 🧩 2. Core Aggregates

The system is organized around the following aggregates:

- **User Aggregate** → identity and authentication
- **Company Aggregate** → business boundary and multi-tenancy root
- **Vehicle Aggregate** → vehicles owned by a company
- **Mileage Aggregate** → vehicle usage tracking
- **Financial Aggregate** → income and expense tracking

Each aggregate has a single **root entity** responsible for consistency.

---

## 👤 3. User Aggregate

### Root: User

Represents a person authenticated in the system.

**Attributes:**
- id (UUID)
- email
- passwordHash
- fullName
- isActive
- createdAt
- updatedAt
- deletedAt?

**Relationships:**
- User *belongs to many* Companies through **CompanyUser**
- User *has many* RefreshTokens

**Rules:**
- Email must be unique
- A user may belong to zero or more companies

---

## 🏢 4. Company Aggregate

### Root: Company

Represents a business boundary that scopes all operational data.

**Attributes:**
- id (UUID)
- name
- document (tax id)
- createdAt
- updatedAt
- deletedAt?

**Relationships:**
- Company *has many* Users through **CompanyUser**
- Company *has many* Vehicles
- Company *has many* FinancialRecords
- Company *has many* MileageRecords

**Rules:**
- Must always have at least one User with role OWNER
- All domain data is scoped by Company

---

## 🔗 5. CompanyUser (Membership)

Represents the membership of a User in a Company.

**Attributes:**
- id (UUID)
- companyId
- userId
- role (OWNER | MEMBER)
- createdAt

**Relationships:**
- Belongs to User
- Belongs to Company

**Rules:**
- A User can appear only once per Company
- Role defines permissions

---

## 🚗 6. Vehicle Aggregate

### Root: Vehicle

Represents a vehicle used to generate income.

**Attributes:**
- id (UUID)
- companyId
- type (motorcycle | car | utility)
- plate?
- model?
- year?
- isActive
- createdAt
- updatedAt
- deletedAt?

**Relationships:**
- Vehicle *belongs to* Company
- Vehicle *has many* MileageRecords
- Vehicle *has many* FinancialRecords (optional association)

**Rules:**
- Must belong to exactly one Company
- Only active vehicles can receive records

---

## 🛣️ 7. Mileage Aggregate

### Root: MileageRecord

Represents usage of a vehicle over time.

**Attributes:**
- id (UUID)
- companyId
- vehicleId
- startKm?
- endKm?
- distance
- recordedAt (date)
- createdAt

**Relationships:**
- Belongs to Company
- Belongs to Vehicle

**Rules:**
- Distance must be positive
- Must not reduce accumulated vehicle mileage
- Must always reference an active vehicle

---

## 💰 8. Financial Aggregate

### Root: FinancialRecord

Represents an income or expense entry.

**Attributes:**
- id (UUID)
- companyId
- vehicleId?
- type (income | expense)
- category
- amount
- description?
- recordDate
- status (ACTIVE | CANCELED)
- createdAt
- updatedAt
- deletedAt?

**Relationships:**
- Belongs to Company
- Optionally belongs to Vehicle

**Rules:**
- Amount must be > 0
- Must always belong to a Company
- Records are immutable (no hard delete)

---

## 🔐 9. RefreshToken

Represents session persistence for authentication.

**Attributes:**
- id (UUID)
- userId
- token
- expiresAt
- revoked
- createdAt

**Relationships:**
- Belongs to User

**Rules:**
- Token must be unique
- Can be revoked

---

## 🧭 10. Key Relationships Overview

- User ⟷ Company → many-to-many via CompanyUser
- Company → Vehicles → many
- Vehicle → MileageRecords → many
- Company → FinancialRecords → many
- Vehicle → FinancialRecords → optional many
- User → RefreshTokens → many

All operational entities (**Vehicle, MileageRecord, FinancialRecord**) are always scoped by **Company**.

---

## 🧾 11. Invariants

The following invariants must always hold:

- No Vehicle without a Company
- No FinancialRecord without a Company
- No MileageRecord without Vehicle and Company
- No Company without at least one OWNER
- No cross-company references

---

## ✅ 12. Final Note

> This data model defines **what exists** in the domain and **how entities relate**.
> It must remain consistent with the Business Logic and database schema.

---

**Status:** Active  
**Type:** Domain Data Model  
**Version:** 1.0


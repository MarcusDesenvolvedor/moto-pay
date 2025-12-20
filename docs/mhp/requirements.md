# 📋 Requirements
**Driver & Motorcycle Rider Management App**

This document captures the **initial product requirements** for the application. Its purpose is to describe **what the system must do** from a user and business perspective.

> ⚠️ This document is used only to derive the **Business Logic**. After that, it becomes a historical reference and must not drive implementation directly.

---

## 🎯 1. Product Vision

Build a mobile application that helps **motorcycle riders and drivers** who earn money using vehicles to:

- Control their finances
- Manage vehicles and mileage
- Organize their activity as individuals or companies
- Generate clear and reliable reports

The product should enable users to evolve from informal control to a **professional operational and financial management tool**.

---

## 👥 2. Target Users

- Motorcycle delivery riders
- App-based drivers
- Freelancers using vehicles for work
- MEIs / sole proprietors
- Small companies with few vehicles

---

## 🧩 3. Core Use Cases

The system must allow users to:

- Create an account and authenticate
- Create and manage companies
- Register and manage vehicles
- Record mileage per vehicle
- Register earnings and expenses
- View financial summaries and reports
- Manage access to company data

---

## 🔐 4. Account & Authentication Requirements

- Users must be able to:
  - Sign up using email and password
  - Log in and log out
  - Recover password
- The system must:
  - Keep user sessions securely
  - Prevent unauthorized access

---

## 🏢 5. Company Management Requirements

- Users must be able to:
  - Create one or more companies
  - Edit company basic information
  - Invite other users to a company
  - Remove users from a company
- The system must:
  - Allow users to belong to multiple companies
  - Isolate data between companies

---

## 🚗 6. Vehicle Management Requirements

- Users must be able to:
  - Register vehicles (type, plate, model, year)
  - Activate or deactivate vehicles
  - View vehicle list per company
- The system must:
  - Associate vehicles with companies
  - Prevent operations on inactive vehicles

---

## 🛣️ 7. Mileage Tracking Requirements

- Users must be able to:
  - Record mileage for a vehicle
  - View mileage history
- The system must:
  - Calculate driven distance when possible
  - Prevent invalid mileage values

---

## 💰 8. Financial Control Requirements

- Users must be able to:
  - Register earnings (incomes)
  - Register expenses
  - Categorize financial records
  - Edit or cancel records
- The system must:
  - Keep historical integrity of records
  - Prevent deletion without trace

---

## 📊 9. Reporting Requirements

- Users must be able to:
  - View summaries by period
  - See total income, expenses and profit
  - Filter reports by vehicle and category
- The system must:
  - Calculate values automatically
  - Ensure consistency with base records

---

## 🔄 10. Multi-company Requirements

- The system must:
  - Support multiple companies per user
  - Enforce access only to allowed companies
  - Scope all data operations to a selected company

---

## 📱 11. Non-functional Requirements

The system should:

- Be easy to use for daily operations
- Have fast response for common actions
- Be available on Android and iOS
- Protect sensitive data
- Be ready to scale with more users and data

---

## 🔮 12. Future Expectations

The system is expected to evolve to support:

- Integrations with delivery and ride apps
- Bank integrations
- Tax and fiscal control
- Advanced fleet management
- Goal tracking and analytics

---

## ✅ 13. Final Note

> These requirements describe **what** the system should do.  
> They exist to derive a precise **Business Logic**.  
> Once Business Logic is defined, it becomes the primary source of truth.

---

**Status:** Initial  
**Type:** Requirements Specification  
**Version:** 1.0


# MotoPay

**Driver & motorcycle rider management — income/expense tracking, vehicles, and financial reports.**

Full-stack mobile application for motorcycle riders and drivers who earn income with their vehicles. Supports multi-company contexts (MEI, PJ, small fleets), vehicle and mileage data, financial records (income/expense), and reports — all scoped by company with role-based access.

> **Portuguese documentation:** [README.pt-BR.md](README.pt-BR.md)

---

## Technologies

| Layer | Stack |
|-------|--------|
| **Mobile** | React Native, Expo 54, TypeScript |
| **State & data** | Zustand (auth), TanStack React Query, React Hook Form + Zod |
| **Navigation** | React Navigation (stack + bottom tabs) |
| **Backend** | NestJS 10, TypeScript |
| **Data** | Prisma ORM, PostgreSQL |
| **Auth** | JWT (access + refresh), Passport, bcrypt |
| **Storage** | Expo Secure Store (tokens) |
| **Media** | Cloudinary (avatar upload) |
| **Build** | EAS (Expo Application Services) for Android/iOS |

---

## Architecture & project structure

Monorepo: one repository with backend API, Expo app, and shared code.

```
moto-pay/
├── App.tsx                    # App entry, auth gate, QueryClient + Navigation
├── navigation/                # App navigator, tabs, profile stack, auth flow
├── shared/                    # Cross-cutting: API client, theme, components, storage
│   ├── api/                   # Axios client, JWT attach, 401 refresh queue
│   ├── theme/                 # Colors, typography, spacing
│   ├── components/            # Reusable UI (Button, Input, Loading, modals, animated)
│   ├── storage/               # Token storage (Secure Store)
│   ├── animations/            # Transitions, tokens
│   └── infrastructure/        # Prisma service, Cloudinary service
├── docs/mhp/
│   ├── business-logic.md      # Business rules (single source of truth)
│   ├── data-model.md
│   └── features/              # Feature-based modules (backend + frontend)
│       ├── authentication/    # Login, signup, refresh, JWT guards
│       ├── companies/         # Create company, list, delete
│       ├── vehicles/          # CRUD vehicles (list, add, delete)
│       ├── add-transaction/   # Create income/expense (company + vehicle)
│       ├── reports/           # Daily summary, reports summary (by date)
│       ├── profile/           # Profile screen, edit profile, avatar
│       └── security/          # Change password, sessions
├── src/                       # NestJS backend entry
│   ├── main.ts                # Bootstrap, ValidationPipe, CORS
│   ├── app.module.ts          # Feature modules, PrismaService
│   └── ...
├── prisma/
│   ├── schema.prisma          # User, Company, CompanyUser, Vehicle, MileageRecord, FinancialRecord, RefreshToken
│   └── migrations/
├── android/                    # Native Android (Expo)
├── app.config.js              # Expo config (MotoPay, slug, env)
├── eas.json                    # EAS Build profiles
└── package.json               # Single package: Nest + Expo deps + scripts
```

**Backend (NestJS):** Feature modules under `docs/mhp/features/*/backend/` with separation of `domain` (entities, repository interfaces), `application` (services), `infrastructure` (repositories), `controllers`, `dto`, `guards`, `strategies`. Shared `PrismaService` and optional infra (e.g. Cloudinary) in `shared/infrastructure/`.

**Frontend (Expo):** Feature UI under `docs/mhp/features/*/frontend/` (screens, hooks, api, types, components). Root `App.tsx` wires auth state (Zustand), React Query, and navigation (auth vs app tabs).

---

## Main features

- **Authentication** — Email/password signup and login; JWT access + refresh; tokens in Secure Store; auth state (Zustand) and init on app load.
- **Companies** — Create company, list companies, delete company; user–company association with roles (OWNER/MEMBER); all data scoped by company.
- **Vehicles** — List vehicles, add vehicle (name, type, plate, model, year, note), delete vehicle; vehicles belong to a company.
- **Transactions** — Add income/expense per company and vehicle (amount, paid, date, note); validation and company membership checks.
- **Reports** — Daily summary (income/expense for today); reports summary by date range; data aggregated from financial records, company-scoped.
- **Profile** — View profile, edit profile (e.g. name), avatar upload (Cloudinary).
- **Security** — Change password; list/revoke sessions (backend DTOs and security feature).

Business rules (multi-company, vehicle and financial constraints, no cross-company data, financial immutability) are documented in `docs/mhp/business-logic.md`.

---

## Running the project locally

### Prerequisites

- Node.js (LTS, e.g. 20+)
- PostgreSQL
- npm (or equivalent)
- Expo Go (for device/simulator) or Android Studio / Xcode for native run

### 1. Clone and install

```bash
git clone <repository-url>
cd moto-pay
npm install
```

### 2. Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` — PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/moto_pay?schema=public`)
- `JWT_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
- `PORT` (default `3001`)
- Optional: Cloudinary env vars for avatar upload

For the app, set `EXPO_PUBLIC_API_URL` (e.g. your machine IP or tunnel URL) so the device can reach the API.

### 3. Database

```bash
npx prisma generate
npx prisma migrate deploy
```

### 4. Backend

```bash
npm run start:dev
```

API runs at `http://localhost:3001` (or the configured `PORT`).

### 5. Mobile app

```bash
npx expo start
```

Use Expo Go or run on Android/iOS simulator. Ensure `EXPO_PUBLIC_API_URL` points to the machine where the backend is running (use tunnel for physical device, e.g. `npm run tunnel`).

### Production build (backend)

```bash
npm run build
npm run start
```

---

## Usage (high level)

1. **Sign up / log in** — Create account or login; tokens are stored and used for all API calls.
2. **Create a company** — From profile, open "My Companies" and create a company.
3. **Add vehicles** — In "My Vehicles", add vehicles linked to the company.
4. **Register transactions** — Use the "Add" tab to add income or expense for a company and vehicle.
5. **View reports** — Home tab shows daily summary and report chart for the selected period.
6. **Profile & security** — Edit profile/avatar and change password or manage sessions from the profile stack.

---

## Practices and patterns

- **Backend**
  - **Repository pattern** — Domain interfaces (e.g. `ITransactionRepository`) and Prisma-based implementations; services depend on abstractions.
  - **DTOs and validation** — Request DTOs with `class-validator`; global `ValidationPipe` (whitelist, forbidNonWhitelisted, transform).
  - **Guards and strategies** — JWT guard and Passport strategy; `@UseGuards(JwtAuthGuard)` and current-user decorator for protected routes.
  - **Feature modules** — Each feature in its own module (auth, companies, vehicles, transactions, reports) with clear boundaries.
- **Frontend**
  - **Feature-based structure** — Per-feature folders with screens, hooks, api, types; shared UI and theme in `shared/`.
  - **Centralized API client** — Single Axios instance; request interceptor attaches access token; response interceptor handles 401 with refresh and request queue to avoid duplicate refresh calls.
  - **Secure token storage** — Access and refresh tokens in Expo Secure Store; auth store (Zustand) hydrates from storage on startup.
  - **Server state** — React Query for reports, lists, and API data; consistent loading and refetch patterns.
- **Shared**
  - **Design tokens** — Centralized colors, typography, spacing in `shared/theme/`.
  - **Reusable components** — Buttons, inputs, loading, modals, animated tab bar components used across screens.

---

## Possible future improvements

- **Tests** — Unit and integration tests for backend services and repositories; E2E for critical flows; frontend component/hook tests.
- **Reporting** — Filters by company/vehicle/category; export (e.g. CSV/PDF); cost-per-kilometer using mileage data.
- **Mileage** — Full mileage recording UI and endpoints (start/end or incremental); validation against business rules (no negative or backward mileage).
- **Integrations** — Banks, delivery platforms (as outlined in business-logic).
- **Offline** — Local cache or queue for transactions when offline, sync when online.
- **Notifications** — Reminders or alerts (e.g. expense due, daily summary).
- **CI/CD** — Automated tests and EAS builds on push/PR.

---

## Project status

**Active.** The app implements authentication, multi-company and vehicle management, financial transactions, reports, profile with avatar, and security (change password / sessions). Backend and mobile coexist in one repo with shared types and config. Suitable for portfolio and further evolution (tests, reporting, integrations) without changing core architecture.

---

## License

See repository license file (if present).

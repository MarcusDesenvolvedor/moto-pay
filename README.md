# MotoPay

**Driver & motorcycle rider management — income/expense tracking, vehicles, and financial reports.**

Full-stack mobile application for motorcycle riders and drivers who earn income with their vehicles. The user manages **companies** (clients) and **vehicles** (their own, independent). Financial entries associate company + vehicle; reports by period, category, and vehicle.

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
| **Charts** | react-native-chart-kit, react-native-svg, react-native-svg-transformer |
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
├── shared/assets/             # SVGs and assets (e.g. avatar fallback)
├── docs/mhp/
│   ├── business-logic.md      # Business rules (single source of truth)
│   ├── data-model.md
│   └── features/              # Feature-based modules (backend + frontend)
│       ├── authentication/    # Login, signup, refresh, JWT guards
│       ├── companies/         # Create, list, delete (companies = user's clients)
│       ├── vehicles/          # CRUD vehicles (belong to user, not company)
│       ├── add-transaction/   # Create income/expense (company + vehicle)
│       ├── reports/           # Daily summary, charts (evolution, category, vehicle), tap-to-show values
│       ├── profile/           # Profile, edit, avatar (SVG fallback when no photo)
│       └── security/          # Change password, sessions
├── src/                       # NestJS backend entry
│   ├── main.ts                # Bootstrap, ValidationPipe, CORS
│   ├── app.module.ts          # Feature modules, PrismaService
│   └── ...
├── prisma/
│   ├── schema.prisma          # User, Company (userId), Vehicle (userId), MileageRecord, FinancialRecord, RefreshToken
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
- **Companies** — Companies are the user's **clients** (`Company.userId`). Create, list, delete; data scoped per company.
- **Vehicles** — Vehicles belong to the **user** (`Vehicle.userId`), not to the company. List, add, delete.
- **Transactions** — Add income/expense associating company (client) + user's vehicle; permission validation.
- **Reports** — Daily summary; charts (evolution, category, vehicle) with values hidden by default and **tap to show**; abbreviation for large numbers (1.5k, 2.3M).
- **Profile** — View profile, edit profile (e.g. name), avatar upload (Cloudinary). SVG fallback when user has no photo.
- **Security** — Change password; list/revoke sessions (backend DTOs and security feature).

Business rules (companies as clients, independent vehicles, immutable transactions) are in `docs/mhp/business-logic.md`.

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
npm install --save-dev @nestjs/cli
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

1. **Sign up / log in** — Create account or login; tokens stored and used for all API calls.
2. **Companies** — From profile: "My Companies" to create companies (clients).
3. **Vehicles** — In "My Vehicles": register vehicles (user's own).
4. **Transactions** — "Add" tab: income or expense (company + vehicle).
5. **Reports** — Home: daily summary and charts; tap to show/hide values.
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
  - **SVG** — `react-native-svg-transformer` to import SVGs as components; avatar fallback in `shared/assets/`.

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

**Active.** The app covers authentication, company (clients) and vehicle (independent) management, financial transactions, interactive reports with charts, profile with avatar (SVG fallback), and security. Backend and mobile in the same repo. Suitable for portfolio and evolution (tests, export, integrations) without changing core architecture.

---

## License

See repository license file (if present).

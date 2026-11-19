# Starline Hospital - Enterprise Next.js Architecture

An industry-standard, production-grade Next.js (App Router) enterprise architecture featuring dual-domain experience: **Public Patient Website** and **Clinical & Administrative Dashboard**, backed by **Django REST Framework (DRF)**.

---

## 🚀 Key Architectural Pillars

### 1. Dual Route Group Architecture (App Router)
- **`(public)`**: Patient-facing portal, medical specialties, doctor profiles, and emergency hotline.
- **`(auth)`**: Centered, distraction-free JWT authentication flow.
- **`(dashboard)`**: Enterprise clinical command center with sidebar navigation, role-filtered items, telemetry, and AG Grid data tables.

### 2. Centralized DRF API & Axios Interceptors
- **Centered Endpoints Dictionary (`src/services/api/endpoints.ts`)**: Single source of truth for all backend Django REST Framework URLs.
- **Auto-Refreshing Axios Client (`src/lib/axios.ts`)**:
  - Automatically attaches `Authorization: Bearer <access_token>` from secure cookies.
  - Catches `401 Unauthorized` responses and triggers the DRF token refresh cycle (`/api/v1/auth/token/refresh/`).
  - Holds pending concurrent requests in a queue while refreshing, retrying all seamlessly on success.
  - Redirects to `/login` upon refresh token expiration.

### 3. JWT Authentication & RBAC (Role-Based Access Control)
- **Hierarchical Roles**: `SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `NURSE`, `RECEPTIONIST`, `PATIENT`.
- **Next.js Edge Middleware (`src/middleware.ts`)**: Protects all `/dashboard/*` routes, inspects JWT and role cookies, and blocks unauthorized route access before rendering.
- **`RoleGuard` Component (`src/components/auth/RoleGuard.tsx`)**: Conditionally renders UI actions (e.g., "Admit Patient", "Manage Users", "Export Reports") based on role permissions.

### 4. Central Color Change (Frontend vs Dashboard) & Dark/Light Mode
- **Frontend Theme**: Clean Medical Emerald (`hsl(168 80% 36%)`) + Cyan accents for a trustworthy, clinical patient experience.
- **Dashboard Theme**: Enterprise Slate Indigo (`hsl(224 76% 48%)`) + Executive dark sidebar (`hsl(222 47% 11%)`) for high-contrast, productive staff workflows.
- Scoped cleanly via `data-theme="dashboard"` on the dashboard layout wrapper.
- Seamless Dark & Light mode integration powered by `next-themes` and Tailwind CSS variables.

### 5. High-Performance AG Grid Component (`src/components/common/DataTable.tsx`)
- Reusable React wrapper around `ag-grid-react` and `ag-grid-community`.
- Auto-switches between `ag-theme-quartz` (light mode) and `ag-theme-quartz-dark` (dark mode).
- Built-in quick search filter, CSV data export, server/client pagination, custom cell renderers (status badges, blood group, actions), and loading state.

---

## 📂 Project Directory Structure

```text
starlinehospital/frontend/
├── .env.example                     # Environment variable blueprint
├── .env.local                       # Local environment configurations
├── components.json                  # shadcn/ui configuration
├── next.config.mjs                  # Next.js optimization & image domain configuration
├── package.json                     # Next.js 15, React 19, AG Grid, Axios, Radix UI
├── postcss.config.mjs               # PostCSS Tailwind engine
├── tailwind.config.ts               # HSL CSS variable mapped Tailwind design system
├── tsconfig.json                    # Strict TypeScript configuration
│
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   ├── layout.tsx           # Centered auth layout
    │   │   └── login/page.tsx       # JWT login with role autofill demos
    │   ├── (dashboard)/
    │   │   ├── layout.tsx           # [data-theme="dashboard"] scoped layout + sidebar
    │   │   └── dashboard/
    │   │       ├── page.tsx         # Clinical stats, metrics & RBAC showcase
    │   │       ├── patients/page.tsx# AG Grid Inpatient Data Table showcase
    │   │       └── unauthorized/page.tsx # 403 Access Denied page
    │   ├── (public)/
    │   │   ├── layout.tsx           # Public navbar & footer layout
    │   │   ├── page.tsx             # Hospital homepage & emergency banner
    │   │   ├── about/page.tsx       # Hospital credentials & facilities
    │   │   ├── contact/page.tsx     # Emergency contact & inquiries
    │   │   └── services/page.tsx    # Centers of clinical excellence
    │   ├── globals.css              # Central CSS variables (Frontend vs Dashboard themes)
    │   ├── layout.tsx               # Root layout + ThemeProvider + AuthProvider
    │   └── not-found.tsx            # Global 404 page
    │
    ├── components/
    │   ├── auth/
    │   │   ├── LoginForm.tsx        # DRF JWT login form with demo credentials
    │   │   └── RoleGuard.tsx        # Conditional RBAC UI element wrapper
    │   ├── common/
    │   │   ├── DataTable.tsx        # Reusable AG Grid component (CSV, search, dark mode)
    │   │   ├── ThemeToggle.tsx      # Dark / Light mode toggle
    │   │   └── UserNav.tsx          # User profile avatar & logout dropdown
    │   ├── layout/
    │   │   ├── dashboard/
    │   │   │   ├── Header.tsx       # Dashboard topbar, mobile drawer, notifications
    │   │   │   └── Sidebar.tsx      # Dynamic role-filtered navigation sidebar
    │   │   └── public/
    │   │       ├── Footer.tsx       # Public website footer
    │   │       └── Navbar.tsx       # Responsive public header
    │   └── ui/                      # shadcn/ui inspired primitives
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       └── skeleton.tsx
    │
    ├── config/
    │   ├── navigation.ts            # Sidebar navigation items mapped to RBAC roles
    │   ├── site.ts                  # Site metadata, phone numbers, addresses
    │   └── themes.ts                # Central color definitions & palette documentation
    │
    ├── context/
    │   ├── AuthContext.tsx          # JWT session state, login/logout, role helpers
    │   └── ThemeProvider.tsx        # next-themes provider wrapper
    │
    ├── hooks/
    │   └── useAuth.ts               # Hook to access user, role, permissions, and logout
    │
    ├── lib/
    │   ├── auth.ts                  # Cookie helpers (get/set/clear) & JWT decode
    │   ├── axios.ts                 # Axios instance with request/response interceptors
    │   ├── rbac.ts                  # RBAC role permissions mapping & helpers
    │   └── utils.ts                 # cn() class utility
    │
    ├── middleware.ts                # Next.js Edge Middleware for route protection
    │
    ├── services/
    │   ├── api/
    │   │   ├── axiosClient.ts       # Typed HTTP verbs (get, post, put, patch, delete)
    │   │   └── endpoints.ts         # Centralized DRF API endpoint paths
    │   ├── auth.service.ts          # DRF simplejwt token login, refresh, profile
    │   └── patient.service.ts       # Inpatient CRUD service for DRF
    │
    └── types/
        ├── api.ts                   # DRF pagination & error interfaces
        ├── auth.ts                  # Role enum, User, TokenResponse, JWTPayload
        ├── patient.ts               # Inpatient domain model
        └── rbac.ts                  # Route permission types
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
Run in your terminal:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Update `NEXT_PUBLIC_API_URL` to point to your running Django REST Framework backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Testing RBAC & Authentication
On `/login`, click any of the **Quick Demo Credential Autofill** buttons:
1. **Admin**: Gives complete administrative access across clinical, billing, and system settings.
2. **Doctor**: Restricts access to clinical telemetry, patients registry, and scheduling.
3. **Reception**: Restricts access to inpatient admissions and billing.

# Starline Enterprise - Next.js 15+ & DRF Architecture

An industry-standard, production-grade Next.js enterprise architecture with separate **Public Website** and **Administrative Dashboard**, backed by **Django REST Framework (DRF)**.

---

## 🚀 Key Architectural Highlights

### 1. Route Groups & Multi-Domain Layouts
- **`(website)`**: Public patient/customer-facing portal (Hero, About, Contact, Services, Blog).
- **`(auth)`**: Centered, distraction-free JWT authentication flow.
- **`(dashboard)`**: Enterprise command center with collapsible sidebar navigation, role-filtered items, telemetry, and AG Grid data tables.

### 2. Modern Next.js `proxy.ts` Convention (Edge Route Guard)
- Upgraded from legacy `middleware.ts` to modern **`src/proxy.ts`** convention.
- Evaluates incoming session cookies at the edge before requests hit React components.
- Protects all `/dashboard/*` routes and redirects unauthenticated users to `/login?redirect=...`.

### 3. Centralized DRF API & Axios Interceptors
- **Endpoints Catalog (`src/lib/axios/api-endpoints.ts`)**: Single source of truth for all backend Django REST Framework URLs.
- **Auto-Refreshing Axios Client (`src/lib/axios/api-client.ts`)**:
  - Automatically attaches `Authorization: Bearer <access_token>` from secure cookies.
  - Catches `401 Unauthorized` responses and triggers the DRF token refresh cycle (`/api/v1/auth/token/refresh/`).
  - Holds concurrent requests in a queue while refreshing, retrying all seamlessly on success.
  - Redirects to `/login` upon refresh token expiration.

### 4. Dual Theming (Frontend vs Dashboard) & Dark/Light Mode
- **Website Theme**: Clean Medical Emerald (`hsl(168 80% 36%)`) + Cyan accents for a trustworthy, clinical patient experience.
- **Dashboard Theme**: Enterprise Slate Indigo (`hsl(224 76% 48%)`) + Executive dark sidebar (`hsl(222 47% 11%)`) for high-contrast, productive staff workflows.
- Scoped via `data-theme="dashboard"` on the dashboard layout shell.
- Dark & Light mode integration powered by `next-themes` and Tailwind CSS variables.

### 5. Reusable AG Grid Component (`src/components/data-table/data-grid.tsx`)
- Auto-switches between `ag-theme-quartz` (light mode) and `ag-theme-quartz-dark` (dark mode).
- Built-in search toolbar, CSV data export, server/client pagination, custom cell renderers (status badges, role badges, action buttons), and loading states.

---

## 📂 Project Structure

```text
starlinehospital/frontend/
├── src/
│   ├── app/
│   │   ├── (website)/
│   │   ├── (auth)/
│   │   ├── (dashboard)/dashboard/
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── shared/
│   │   └── data-table/
│   ├── features/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── roles/
│   │   └── reports/
│   ├── layouts/
│   │   ├── website/
│   │   └── dashboard/
│   ├── lib/
│   │   ├── axios/
│   │   ├── auth/
│   │   └── ag-grid/
│   ├── proxy.ts                  # Modern Next.js proxy route protection
│   └── stores/
```

---

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
```

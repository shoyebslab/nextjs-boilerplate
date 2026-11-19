export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/token/",
    REFRESH: "/auth/token/refresh/",
    VERIFY: "/auth/token/verify/",
    LOGOUT: "/auth/logout/",
    ME: "/auth/users/me/",
    FORGOT_PASSWORD: "/auth/password/reset/",
    RESET_PASSWORD: "/auth/password/reset/confirm/",
  },
  USERS: {
    LIST: "/users/",
    DETAIL: (id: string | number) => `/users/${id}/`,
    CREATE: "/users/",
    UPDATE: (id: string | number) => `/users/${id}/`,
    DELETE: (id: string | number) => `/users/${id}/`,
  },
  ROLES: {
    LIST: "/roles/",
    DETAIL: (id: string | number) => `/roles/${id}/`,
    PERMISSIONS: "/roles/permissions/",
  },
  PERMISSIONS: {
    LIST: "/permissions/",
  },
  REPORTS: {
    ANALYTICS: "/reports/analytics/",
    STATS: "/reports/stats/",
    EXPORT: "/reports/export/",
  },
  SETTINGS: {
    GET: "/settings/",
    UPDATE: "/settings/",
  },
} as const;

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  USER: "USER",
  GUEST: "GUEST",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  USERS_VIEW: "users:view",
  USERS_CREATE: "users:create",
  USERS_EDIT: "users:edit",
  USERS_DELETE: "users:delete",

  ROLES_VIEW: "roles:view",
  ROLES_MANAGE: "roles:manage",

  PERMISSIONS_VIEW: "permissions:view",
  PERMISSIONS_MANAGE: "permissions:manage",

  REPORTS_VIEW: "reports:view",
  REPORTS_EXPORT: "reports:export",

  SETTINGS_VIEW: "settings:view",
  SETTINGS_EDIT: "settings:edit",
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<RoleType, PermissionType[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.PERMISSIONS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
  ],
  [ROLES.USER]: [PERMISSIONS.REPORTS_VIEW],
  [ROLES.GUEST]: [],
};

import { PermissionType, RoleType, ROLE_PERMISSIONS, ROLES } from "@/config/permissions.config";

export function getRolePermissions(role: RoleType): PermissionType[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function roleHasPermission(role: RoleType, permission: PermissionType): boolean {
  if (role === ROLES.SUPER_ADMIN) return true;
  const permissions = getRolePermissions(role);
  return permissions.includes(permission);
}

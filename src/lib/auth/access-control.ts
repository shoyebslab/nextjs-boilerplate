import { RoleType, PermissionType, ROLES } from "@/config/permissions.config";
import { roleHasPermission } from "./permissions";

export interface UserAccessProfile {
  role: RoleType;
  permissions?: PermissionType[];
}

export function canAccess(
  user: UserAccessProfile | null,
  options: {
    roles?: RoleType[];
    permissions?: PermissionType[];
  }
): boolean {
  if (!user) return false;
  if (user.role === ROLES.SUPER_ADMIN) return true;

  if (options.roles && options.roles.length > 0) {
    if (!options.roles.includes(user.role)) return false;
  }

  if (options.permissions && options.permissions.length > 0) {
    const userDirectPerms = user.permissions || [];
    const hasEveryPerm = options.permissions.every(
      (perm) => userDirectPerms.includes(perm) || roleHasPermission(user.role, perm)
    );
    if (!hasEveryPerm) return false;
  }

  return true;
}

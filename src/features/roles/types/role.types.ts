import { RoleType, PermissionType } from "@/config/permissions.config";

export interface RoleDetail {
  id: string;
  name: RoleType;
  description: string;
  permissions: PermissionType[];
  users_count: number;
}

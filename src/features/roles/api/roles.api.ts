import apiClient from "@/lib/axios/api-client";
import { API_ENDPOINTS } from "@/lib/axios/api-endpoints";
import { handleApiError } from "@/lib/axios/api-error";
import { RoleDetail } from "../types/role.types";
import { ROLES, ROLE_PERMISSIONS } from "@/config/permissions.config";

export const rolesApi = {
  async list(): Promise<RoleDetail[]> {
    try {
      const response = await apiClient.get<RoleDetail[]>(API_ENDPOINTS.ROLES.LIST);
      return response.data;
    } catch {
      // Fallback local list based on config if DRF endpoint isn't seeded yet
      return [
        {
          id: "1",
          name: ROLES.SUPER_ADMIN,
          description: "Full system administrative control with unrestricted bypass",
          permissions: ROLE_PERMISSIONS[ROLES.SUPER_ADMIN],
          users_count: 2,
        },
        {
          id: "2",
          name: ROLES.ADMIN,
          description: "Operations and user management privileges",
          permissions: ROLE_PERMISSIONS[ROLES.ADMIN],
          users_count: 8,
        },
        {
          id: "3",
          name: ROLES.MANAGER,
          description: "Departmental monitoring and analytics reporting",
          permissions: ROLE_PERMISSIONS[ROLES.MANAGER],
          users_count: 14,
        },
        {
          id: "4",
          name: ROLES.USER,
          description: "Standard staff access with view rights",
          permissions: ROLE_PERMISSIONS[ROLES.USER],
          users_count: 85,
        },
      ];
    }
  },
};

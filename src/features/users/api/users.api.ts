import apiClient from "@/lib/axios/api-client";
import { API_ENDPOINTS } from "@/lib/axios/api-endpoints";
import { handleApiError } from "@/lib/axios/api-error";
import { DRFPaginatedResponse, PaginationParams } from "@/types/api.types";
import { UserItem, UserFormData } from "../types/user.types";

export const usersApi = {
  async list(params?: PaginationParams): Promise<DRFPaginatedResponse<UserItem>> {
    try {
      const response = await apiClient.get<DRFPaginatedResponse<UserItem>>(
        API_ENDPOINTS.USERS.LIST,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: string | number): Promise<UserItem> {
    try {
      const response = await apiClient.get<UserItem>(API_ENDPOINTS.USERS.DETAIL(id));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: UserFormData): Promise<UserItem> {
    try {
      const response = await apiClient.post<UserItem>(API_ENDPOINTS.USERS.CREATE, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: string | number, data: Partial<UserFormData>): Promise<UserItem> {
    try {
      const response = await apiClient.patch<UserItem>(
        API_ENDPOINTS.USERS.UPDATE(id),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async remove(id: string | number): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

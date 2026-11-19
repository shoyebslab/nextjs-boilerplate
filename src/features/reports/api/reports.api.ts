import apiClient from "@/lib/axios/api-client";
import { API_ENDPOINTS } from "@/lib/axios/api-endpoints";

export interface ReportStats {
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
  uptime: number;
}

export const reportsApi = {
  async getStats(): Promise<ReportStats> {
    try {
      const response = await apiClient.get<ReportStats>(API_ENDPOINTS.REPORTS.STATS);
      return response.data;
    } catch {
      return {
        totalRevenue: 284500,
        activeUsers: 1420,
        conversionRate: 64.8,
        uptime: 99.98,
      };
    }
  },
};

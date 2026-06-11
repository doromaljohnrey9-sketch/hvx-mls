import { axiosInstance } from "@/config/axios.config";
import type { SelectSchool } from "@/types/drizzle.types";

import { API_ROUTES } from "@/constants/routes.constant";

export const schoolsService = {
  getAll: async (): Promise<SelectSchool[]> => {
    try {
      const response = await axiosInstance.get<{ data: SelectSchool[] }>(API_ROUTES.SCHOOLS);
      return response.data.data ?? [];
    } catch (error) {
      console.error("Failed to fetch schools:", error);
      return [];
    }
  },
  create: async (data: { name: string; branchId: string }): Promise<SelectSchool | null> => {
    try {
      const response = await axiosInstance.post<{ data: SelectSchool }>(API_ROUTES.SCHOOLS, data);
      return response.data.data ?? null;
    } catch (error) {
      console.error("Failed to create school:", error);
      return null;
    }
  },
};

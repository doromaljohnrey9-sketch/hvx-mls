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
};

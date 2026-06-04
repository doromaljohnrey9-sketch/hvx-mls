import { axiosInstance } from "@/config/axios.config";

import { API_ROUTES } from "@/constants/routes.constant";
import type { Teacher } from "@/types/teacher.types";

export const teachersService = {
  getAll: async (branchId?: string, schoolId?: string): Promise<Teacher[]> => {
    try {
      const params = new URLSearchParams();
      if (branchId) params.append("branchId", branchId);
      if (schoolId) params.append("schoolId", schoolId);

      const queryString = params.toString();
      const url = queryString ? `${API_ROUTES.TEACHERS}?${queryString}` : API_ROUTES.TEACHERS;

      const response = await axiosInstance.get<{ data: Teacher[] }>(url);
      return response.data.data ?? [];
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      return [];
    }
  },
};

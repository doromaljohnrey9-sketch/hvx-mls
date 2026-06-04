import { axiosInstance } from "@/config/axios.config";
import type { SelectBranch } from "@/types/drizzle.types";

import { API_ROUTES } from "@/constants/routes.constant";

export const branchesService = {
  getAll: async (): Promise<SelectBranch[]> => {
    try {
      const response = await axiosInstance.get<{ data: SelectBranch[] }>(API_ROUTES.BRANCHES);
      return response.data.data ?? [];
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      return [];
    }
  },
};

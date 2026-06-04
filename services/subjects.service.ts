import { axiosInstance } from "@/config/axios.config";
import { API_ROUTES } from "@/constants/routes.constant";

export const subjectsService = {
  getAll: async (): Promise<string[]> => {
    try {
      const response = await axiosInstance.get<{ data: string[] }>(API_ROUTES.SUBJECTS);
      return response.data.data ?? [];
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      return [];
    }
  },
};

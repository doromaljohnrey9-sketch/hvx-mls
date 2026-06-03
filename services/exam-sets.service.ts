import { axiosInstance } from "@/config/axios.config";
import type { SelectExamSet, InsertExamSet } from "@/types/drizzle.types";

import { API_ROUTES } from "@/constants/routes.constant";

export const examSetsService = {
  getAll: async (): Promise<SelectExamSet[]> => {
    try {
      const response = await axiosInstance.get<{ data: SelectExamSet[] }>(API_ROUTES.EXAM_SETS);
      return response.data.data ?? [];
    } catch (error) {
      console.error("Failed to fetch exam sets:", error);
      return [];
    }
  },
  create: async (data: InsertExamSet): Promise<SelectExamSet | null> => {
    try {
      const response = await axiosInstance.post<{ success: boolean; data: SelectExamSet }>(
        API_ROUTES.EXAM_SETS,
        data
      );
      return response.data.data ?? null;
    } catch (error) {
      console.error("Failed to create exam set:", error);
      return null;
    }
  },
};

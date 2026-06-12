import { axiosInstance } from "@/config/axios.config";
import type { SelectExamSet, InsertExamSet } from "@/types/drizzle.types";

import { API_ROUTES } from "@/constants/routes.constant";
import type { ExamSetsQueryParams } from "@/queries/exam-sets.query";

export const examSetsService = {
  getAll: async (params?: ExamSetsQueryParams) => {
    try {
      const response = await axiosInstance.get<{ data: { data: SelectExamSet[]; total: number } }>(
        API_ROUTES.EXAM_SETS,
        {
          params,
        }
      );
      return response.data.data ?? { data: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch exam sets:", error);
      return { data: [], total: 0 };
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

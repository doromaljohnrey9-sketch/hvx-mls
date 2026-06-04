import { axiosInstance } from "@/config/axios.config";

import { API_ROUTES } from "@/constants/routes.constant";
import type { DashboardStats } from "@/types/dashboard.types";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: DashboardStats }>(
        API_ROUTES.DASHBOARD.STATS
      );
      return (
        response.data.data ?? {
          totalUsers: 0,
          totalExamSets: 0,
          totalVideos: 0,
          usersByRole: [],
          examSetsByStatus: [],
          usersThisWeek: 0,
          publishedExamSets: 0,
        }
      );
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      return {
        totalUsers: 0,
        totalExamSets: 0,
        totalVideos: 0,
        usersByRole: [],
        examSetsByStatus: [],
        usersThisWeek: 0,
        publishedExamSets: 0,
      };
    }
  },
};

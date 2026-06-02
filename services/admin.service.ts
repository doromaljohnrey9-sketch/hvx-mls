import { axiosInstance } from "@/config/axios.config";
import type { SelectProfile, UserRole } from "@/types/drizzle.types";

import { API_ROUTES } from "@/constants/routes.constant";

export const adminService = {
  getStudents: async (roleFilter?: UserRole): Promise<SelectProfile[]> => {
    try {
      const params = roleFilter ? `?role=${roleFilter}` : "";
      const response = await axiosInstance.get<{ data: SelectProfile[] }>(
        `${API_ROUTES.ADMIN.STUDENTS}${params}`
      );
      return response.data.data ?? [];
    } catch (error) {
      console.error("Failed to fetch students:", error);
      return [];
    }
  },

  updateStudentRole: async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      await axiosInstance.patch(API_ROUTES.ADMIN.STUDENTS, { userId, role });
      return true;
    } catch (error) {
      console.error("Failed to update student role:", error);
      return false;
    }
  },
};

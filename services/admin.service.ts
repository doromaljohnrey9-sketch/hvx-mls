import { axiosInstance } from "@/config/axios.config";
import type { SelectProfile, UserRole, ApprovalStatus } from "@/types/drizzle.types";
import type { AdminUsersResponse, AdminUsersQueryParams } from "@/types/admin.types";

import { API_ROUTES } from "@/constants/routes.constant";

export const adminService = {
  getStudents: async (roleFilter?: UserRole): Promise<SelectProfile[]> => {
    try {
      const params = roleFilter ? `?role=${roleFilter}` : "";
      const response = await axiosInstance.get<{ success: boolean; data: SelectProfile[] }>(
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

  updateStudentApprovalStatus: async (
    userId: string,
    approvalStatus: ApprovalStatus
  ): Promise<boolean> => {
    try {
      await axiosInstance.patch(API_ROUTES.ADMIN.STUDENTS, { userId, approvalStatus });
      return true;
    } catch (error) {
      console.error("Failed to update student approval status:", error);
      return false;
    }
  },

  getAdminUsers: async (params: AdminUsersQueryParams): Promise<AdminUsersResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.role) queryParams.append("role", params.role);
      if (params.approvalStatus) queryParams.append("approvalStatus", params.approvalStatus);

      const url = `${API_ROUTES.ADMIN.STUDENTS}?${queryParams.toString()}`;
      const response = await axiosInstance.get<{ success: boolean; data: AdminUsersResponse }>(url);
      return response.data.data ?? { users: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch admin users:", error);
      return { users: [], total: 0 };
    }
  },
};

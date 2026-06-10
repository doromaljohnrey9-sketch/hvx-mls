import { axiosInstance } from "@/config/axios.config";
import type { SelectProfile, UserRole, ApprovalStatus } from "@/types/drizzle.types";
import type { AdminUsersResponse, AdminUsersQueryParams } from "@/types/admin.types";

import { API_ROUTES } from "@/constants/routes.constant";

export const adminService = {
  createUser: async (data: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    branchId?: string;
    schoolId?: string;
    grade?: number;
    assignedTeacher?: string;
    approvalStatus?: ApprovalStatus;
  }): Promise<any | null> => {
    try {
      const response = await axiosInstance.post<{ success: boolean; data: any }>(
        API_ROUTES.ADMIN.USERS,
        data
      );
      return response.data.data ?? null;
    } catch (error) {
      console.error("Failed to create user:", error);
      return null;
    }
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      await axiosInstance.patch(API_ROUTES.ADMIN.USERS, { userId, role });
      return true;
    } catch (error) {
      console.error("Failed to update user role:", error);
      return false;
    }
  },

  updateUserApprovalStatus: async (
    userId: string,
    approvalStatus: ApprovalStatus
  ): Promise<boolean> => {
    try {
      await axiosInstance.patch(API_ROUTES.ADMIN.USERS, { userId, approvalStatus });
      return true;
    } catch (error) {
      console.error("Failed to update user approval status:", error);
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

      const url = `${API_ROUTES.ADMIN.USERS}?${queryParams.toString()}`;
      const response = await axiosInstance.get<{ success: boolean; data: AdminUsersResponse }>(url);
      return response.data.data ?? { users: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch admin users:", error);
      return { users: [], total: 0 };
    }
  },
};

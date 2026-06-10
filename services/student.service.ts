import { axiosInstance } from "@/config/axios.config";
import type { ApprovalStatus } from "@/types/drizzle.types";
import type { StudentsResponse, StudentsQueryParams, StudentUpdate } from "@/types/student.types";

import { API_ROUTES } from "@/constants/routes.constant";

export const studentService = {
  getStudents: async (params: StudentsQueryParams): Promise<StudentsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
      if (params.search) queryParams.append("search", params.search);
      queryParams.append("role", "student");
      if (params.approvalStatus) queryParams.append("approvalStatus", params.approvalStatus);
      if (params.branchId) queryParams.append("branchId", params.branchId);
      if (params.schoolId) queryParams.append("schoolId", params.schoolId);
      if (params.grade) queryParams.append("grade", params.grade.toString());

      const url = `${API_ROUTES.ADMIN.USERS}?${queryParams.toString()}`;
      const response = await axiosInstance.get<{ success: boolean; data: StudentsResponse }>(url);
      return response.data.data ?? { students: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch students:", error);
      return { students: [], total: 0 };
    }
  },

  updateStudent: async (studentId: string, updates: StudentUpdate): Promise<boolean> => {
    try {
      await axiosInstance.patch(API_ROUTES.ADMIN.USERS, { userId: studentId, ...updates });
      return true;
    } catch (error) {
      console.error("Failed to update student:", error);
      return false;
    }
  },

  updateStudentApprovalStatus: async (
    studentId: string,
    approvalStatus: ApprovalStatus
  ): Promise<boolean> => {
    try {
      await axiosInstance.patch(API_ROUTES.ADMIN.USERS, { userId: studentId, approvalStatus });
      return true;
    } catch (error) {
      console.error("Failed to update student approval status:", error);
      return false;
    }
  },

  updateStudentGrade: async (studentId: string, grade: number): Promise<boolean> => {
    try {
      await axiosInstance.patch(API_ROUTES.ADMIN.USERS, { userId: studentId, grade });
      return true;
    } catch (error) {
      console.error("Failed to update student grade:", error);
      return false;
    }
  },

  updateStudentTeacher: async (studentId: string, assignedTeacher: string): Promise<boolean> => {
    try {
      await axiosInstance.patch(API_ROUTES.ADMIN.USERS, { userId: studentId, assignedTeacher });
      return true;
    } catch (error) {
      console.error("Failed to update student teacher:", error);
      return false;
    }
  },
};

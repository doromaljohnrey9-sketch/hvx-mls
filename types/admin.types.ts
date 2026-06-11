import type { SelectProfile, UserRole, ApprovalStatus } from "./drizzle.types";

export type AdminUser = SelectProfile & {
  branchName?: string | null;
  schoolName?: string | null;
  approverName?: string | null;
};

export interface AdminUserUpdate {
  name?: string;
  role?: UserRole;
  approvalStatus?: ApprovalStatus;
  branchId?: string | null;
  schoolId?: string | null;
  grade?: number | null;
  assignedTeacher?: string | null;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
}

export interface AdminUsersQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  approvalStatus?: ApprovalStatus;
}

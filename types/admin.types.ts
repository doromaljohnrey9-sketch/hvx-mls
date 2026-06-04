import type { SelectProfile, UserRole, ApprovalStatus } from "./drizzle.types";

export type AdminUser = SelectProfile & {
  branchName?: string | null;
  approverName?: string | null;
};

export interface AdminUserUpdate {
  role?: UserRole;
  approvalStatus?: ApprovalStatus;
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

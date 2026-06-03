import type { SelectProfile, UserRole } from "./drizzle.types";

export type AdminUser = SelectProfile & {
  branchName?: string | null;
};

export interface AdminUserUpdate {
  role?: UserRole;
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
}

import type { SelectProfile, ApprovalStatus } from "./drizzle.types";

export type Student = SelectProfile & {
  branchName?: string | null;
  schoolName?: string | null;
  approverName?: string | null;
  assignedTeacherName?: string | null;
};

export interface StudentUpdate {
  approvalStatus?: ApprovalStatus;
  grade?: number;
  assignedTeacher?: string;
  branchId?: string;
  schoolId?: string;
}

export interface StudentsResponse {
  students: Student[];
  total: number;
}

export interface StudentsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  approvalStatus?: ApprovalStatus;
  branchId?: string;
  schoolId?: string;
  grade?: number;
}

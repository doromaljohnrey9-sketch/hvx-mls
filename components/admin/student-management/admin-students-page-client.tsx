"use client";

import { useAdminStudentManagement } from "@/hooks/admin/use-admin-student-management";
import { StudentsPageHeader } from "@/components/admin/student-management/students-page-header";
import { StudentsTable } from "@/components/admin/student-management/students-table";
import { StudentsFilters } from "@/components/admin/student-management/students-filters";
import { createStudentsColumns } from "@/components/admin/student-management/students-columns";
import { useAuth } from "@/hooks/use-auth";

import { useTranslations } from "next-intl";

export function AdminStudentsPageClient() {
  const t = useTranslations("StudentManagement");
  const tStatuses = useTranslations("Dashboard.statuses");
  const { profile } = useAuth();

  const {
    students,
    isLoading,
    updateStudent,
    updateStudentApprovalStatus,
    updateStudentGrade,
    updateStudentTeacher,
    search,
    approvalStatusFilter,
    branchFilter,
    schoolFilter,
    gradeFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleApprovalStatusFilterChange,
    handleBranchFilterChange,
    handleSchoolFilterChange,
    handleGradeFilterChange,
    handlePageChange,
  } = useAdminStudentManagement();

  const columns = createStudentsColumns({
    updateStudent,
    t,
    tStatuses,
    currentUserRole: profile?.role,
    currentUserBranchId: profile?.branchId,
  });

  return (
    <div className="flex-1 min-w-0 space-y-6 p-8">
      <StudentsPageHeader />
      <StudentsFilters
        search={search}
        approvalStatusFilter={approvalStatusFilter}
        branchFilter={branchFilter}
        schoolFilter={schoolFilter}
        gradeFilter={gradeFilter}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onApprovalStatusFilterChange={handleApprovalStatusFilterChange}
        onBranchFilterChange={handleBranchFilterChange}
        onSchoolFilterChange={handleSchoolFilterChange}
        onGradeFilterChange={handleGradeFilterChange}
      />
      <StudentsTable
        columns={columns}
        data={students.data?.students ?? []}
        isLoading={isLoading}
        pagination={{
          page,
          pageSize,
          total: students.data?.total ?? 0,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}

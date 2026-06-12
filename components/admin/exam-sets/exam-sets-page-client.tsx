"use client";

import { useExamSetsManagement } from "@/hooks/admin/use-exam-sets-management";
import { ExamSetsPageHeader } from "./exam-sets-page-header";
import { ExamSetsFilters } from "./exam-sets-filters";
import { ExamSetsTable } from "./exam-sets-table";
import { createExamSetsColumns } from "./exam-sets-columns";
import { useAuth } from "@/hooks/use-auth";

import { useTranslations } from "next-intl";

export function ExamSetsPageClient() {
  const t = useTranslations("ExamSets");
  const tStatus = useTranslations("ExamSets.status");

  const { user } = useAuth();
  const {
    examSets,
    isLoading,
    createExamSet,
    updateExamSet,
    deleteExamSet,
    search,
    statusFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleStatusFilterChange,
    handlePageChange,
  } = useExamSetsManagement();

  const columns = createExamSetsColumns({
    updateExamSet: updateExamSet,
    deleteExamSet: deleteExamSet,
    currentUserId: user?.id,
    t,
    tStatus,
  });

  const handleCreateExamSet = (data: any) => {
    createExamSet.mutate(data);
  };

  return (
    <div className="flex-1 min-w-0 space-y-6 p-8">
      <ExamSetsPageHeader />
      <ExamSetsFilters
        search={search}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onStatusFilterChange={handleStatusFilterChange}
        onCreateExamSet={handleCreateExamSet}
      />
      <ExamSetsTable
        columns={columns}
        data={examSets?.data?.data ?? []}
        isLoading={isLoading}
        pagination={{
          page,
          pageSize,
          total: examSets?.data?.total ?? 0,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useExamSetsManagement } from "@/hooks/admin/use-exam-sets-management";
import { ExamSetsPageHeader } from "./exam-sets-page-header";
import { ExamSetsFilters } from "./exam-sets-filters";
import { ExamSetsTable } from "./exam-sets-table";
import { createExamSetsColumns } from "./exam-sets-columns";
import { ExamSetDeleteDialog } from "./exam-set-delete-dialog";
import { ExamSetUpdateDialog } from "./exam-set-update-dialog";
import { useAuth } from "@/hooks/use-auth";
import type { ExamSetWithSchool } from "@/hooks/admin/use-exam-sets-management";
import type { ExamSetStatus } from "@/types/drizzle.types";

import { useTranslations } from "next-intl";

export function ExamSetsPageClient() {
  const t = useTranslations("ExamSets");
  const tStatusTranslations = useTranslations("ExamSets.status");

  const { user } = useAuth();
  const [selectedExamSetForDelete, setSelectedExamSetForDelete] =
    useState<ExamSetWithSchool | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExamSetForUpdate, setSelectedExamSetForUpdate] =
    useState<ExamSetWithSchool | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const {
    examSets,
    isLoading,
    createExamSet,
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

  const tStatus = (status: ExamSetStatus) => tStatusTranslations(status);

  const columns = createExamSetsColumns({
    onUpdate: (examSet) => {
      setSelectedExamSetForUpdate(examSet);
      setIsUpdateDialogOpen(true);
    },
    onDelete: (examSet) => {
      setSelectedExamSetForDelete(examSet);
      setIsDeleteDialogOpen(true);
    },
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
      {selectedExamSetForDelete && (
        <ExamSetDeleteDialog
          examSet={selectedExamSetForDelete}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          key={selectedExamSetForDelete.id}
        />
      )}
      {selectedExamSetForUpdate && (
        <ExamSetUpdateDialog
          examSet={selectedExamSetForUpdate}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          key={selectedExamSetForUpdate.id}
        />
      )}
    </div>
  );
}

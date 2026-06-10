"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";

import type { Student, StudentUpdate } from "@/types/student.types";
import type { ApprovalStatus } from "@/types/drizzle.types";

interface StudentActionsDropdownProps {
  student: Student;
  updateStudent: {
    mutate: (data: { id: string; updates: StudentUpdate }) => void;
    isPending?: boolean;
  };
  updateStudentApprovalStatus: {
    mutate: (data: { id: string; approvalStatus: ApprovalStatus }) => void;
    isPending?: boolean;
  };
  updateStudentGrade: {
    mutate: (data: { id: string; grade: number }) => void;
    isPending?: boolean;
  };
  updateStudentTeacher: {
    mutate: (data: { id: string; assignedTeacher: string }) => void;
    isPending?: boolean;
  };
  statusLabels: Record<string, string>;
}

import { useTranslations } from "next-intl";

export function StudentActionsDropdown({
  student,
  updateStudentApprovalStatus,
  updateStudentGrade,
  updateStudentTeacher,
  statusLabels,
}: StudentActionsDropdownProps) {
  const t = useTranslations("StudentManagement");
  const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus | null>(student.approvalStatus);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(student.grade || null);
  const [isOpen, setIsOpen] = useState(false);

  const availableStatuses: ApprovalStatus[] = ["pending", "approved", "rejected", "blocked"];
  const availableGrades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const handleConfirm = () => {
    let hasChanges = false;

    if (selectedStatus && selectedStatus !== student.approvalStatus) {
      updateStudentApprovalStatus.mutate({
        id: student.id,
        approvalStatus: selectedStatus,
      });
      hasChanges = true;
    }

    if (selectedGrade !== null && selectedGrade !== student.grade) {
      updateStudentGrade.mutate({
        id: student.id,
        grade: selectedGrade,
      });
      hasChanges = true;
    }

    if (hasChanges) {
      toast.success(t("toasts.updated"), {
        description: t("toasts.updatedDesc"),
      });
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={updateStudentApprovalStatus.isPending || updateStudentGrade.isPending}
        >
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("table.status")}</DropdownMenuLabel>
        {availableStatuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={selectedStatus === status}
            onCheckedChange={(checked) => checked && setSelectedStatus(status)}
            onSelect={(e) => e.preventDefault()}
          >
            {statusLabels[status]}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t("table.grade")}</DropdownMenuLabel>
        {availableGrades.map((grade) => (
          <DropdownMenuCheckboxItem
            key={grade}
            checked={selectedGrade === grade}
            onCheckedChange={(checked) => checked && setSelectedGrade(grade)}
            onSelect={(e) => e.preventDefault()}
          >
            {grade}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <div className="flex items-center justify-end gap-2 p-2">
          <Button size="sm" onClick={handleConfirm} disabled={updateStudentApprovalStatus.isPending}>
            {t("table.save")}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";

import { StudentEditDialog } from "./student-edit-dialog";

import type { Student, StudentUpdate } from "@/types/student.types";

interface StudentActionsDropdownProps {
  student: Student;
  updateStudent: {
    mutate: (data: { id: string; updates: StudentUpdate }) => void;
    isPending?: boolean;
  };
  currentUserRole?: string | null;
  currentUserBranchId?: string | null;
}

import { useTranslations } from "next-intl";

export function StudentActionsDropdown({
  student,
  updateStudent,
  currentUserRole,
  currentUserBranchId,
}: StudentActionsDropdownProps) {
  const t = useTranslations("StudentManagement");
  const [editOpen, setEditOpen] = useState(false);

  // Permission check: Teachers can only edit students in their branch
  // Super admins can edit all students
  const canEditStudent =
    currentUserRole === "super_admin" ||
    (currentUserRole === "teacher" && currentUserBranchId === student.branchId);

  const isSuperAdmin = currentUserRole === "super_admin";

  const handleUpdateStudent = (data: { id: string; updates: StudentUpdate }) => {
    updateStudent.mutate(data);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={updateStudent.isPending || !canEditStudent}
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)} disabled={!canEditStudent}>
            {t("table.edit")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <StudentEditDialog
        student={student}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdateStudent={handleUpdateStudent}
        isSuperAdmin={isSuperAdmin}
      />
    </>
  );
}

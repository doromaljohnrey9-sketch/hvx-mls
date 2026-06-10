"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentActionsDropdown } from "@/components/admin/student-management/student-actions-dropdown";
import {
  ArrowUpDownIcon,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Calendar,
  User,
  SchoolIcon,
  Building,
  BookOpen,
} from "lucide-react";

import type { Student, StudentUpdate } from "@/types/student.types";
import type { ApprovalStatus } from "@/types/drizzle.types";
import { formatDate } from "@/lib/utils";

import { useTranslations } from "next-intl";

interface CreateStudentsColumnsProps {
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
  t: ReturnType<typeof useTranslations<"StudentManagement">>;
  tStatuses: ReturnType<typeof useTranslations<"Dashboard.statuses">>;
}

export function createStudentsColumns({
  updateStudent,
  updateStudentApprovalStatus,
  updateStudentGrade,
  updateStudentTeacher,
  t,
  tStatuses,
}: CreateStudentsColumnsProps) {
  const APPROVAL_STATUS_LABELS: Record<string, string> = {
    pending: tStatuses("pending"),
    approved: tStatuses("approved"),
    rejected: tStatuses("rejected"),
    blocked: tStatuses("blocked"),
  };

  const STATUS_ICONS: Record<string, React.ReactNode> = {
    pending: <Clock className="size-3" />,
    approved: <CheckCircle className="size-3" />,
    rejected: <XCircle className="size-3" />,
    blocked: <Ban className="size-3" />,
  };

  const columns: ColumnDef<Student>[] = [
    {
      id: "spacer",
      header: () => null,
      cell: () => null,
      size: 48,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.name")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-foreground truncate">
                {student.name || "N/A"}
              </span>
              <span className="text-xs text-muted-foreground truncate">{student.email}</span>
            </div>
          </div>
        );
      },
      size: 260,
    },
    {
      accessorKey: "grade",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.grade")}
          <ArrowUpDownIcon className="ml-2 size-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{student.grade || "N/A"}</span>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "approvalStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.status")}
          <ArrowUpDownIcon className="ml-2 size-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original;
        const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          pending: "secondary",
          approved: "default",
          rejected: "destructive",
          blocked: "outline",
        };
        return (
          <Badge variant={statusVariant[student.approvalStatus] || "secondary"}>
            {STATUS_ICONS[student.approvalStatus]}
            {APPROVAL_STATUS_LABELS[student.approvalStatus] || student.approvalStatus}
          </Badge>
        );
      },
      size: 160,
    },
    {
      accessorKey: "branchName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.branch")}
          <ArrowUpDownIcon className="ml-2 size-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-2">
            <Building className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{student.branchName || "N/A"}</span>
          </div>
        );
      },
      size: 180,
    },
    {
      accessorKey: "schoolName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.school")}
          <ArrowUpDownIcon className="ml-2 size-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-2">
            <SchoolIcon className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{student.schoolName || "N/A"}</span>
          </div>
        );
      },
      size: 180,
    },
    {
      accessorKey: "assignedTeacherName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.teacher")}
          <ArrowUpDownIcon className="ml-2 size-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">
              {student.assignedTeacherName || student.assignedTeacher || "N/A"}
            </span>
          </div>
        );
      },
      size: 180,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.joined")}
          <ArrowUpDownIcon className="ml-2 size-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {formatDate(student.createdAt)}
            </span>
          </div>
        );
      },
      size: 140,
    },
    {
      accessorKey: "approvedBy",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.approvedBy")}
          <ArrowUpDownIcon className="ml-2 size-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{student.approverName || "N/A"}</span>
          </div>
        );
      },
      size: 160,
    },
    {
      accessorKey: "approvedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.approvedAt")}
          <ArrowUpDownIcon className="ml-2 size-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {formatDate(student.approvedAt)}
            </span>
          </div>
        );
      },
      size: 140,
    },
    {
      id: "actions",
      header: () => (
        <div className="text-sm font-semibold text-foreground">{t("table.actions")}</div>
      ),
      cell: ({ row }) => {
        const student = row.original;

        return (
          <StudentActionsDropdown
            student={student}
            updateStudent={updateStudent}
            updateStudentApprovalStatus={updateStudentApprovalStatus}
            updateStudentGrade={updateStudentGrade}
            updateStudentTeacher={updateStudentTeacher}
            statusLabels={APPROVAL_STATUS_LABELS}
          />
        );
      },
      size: 80,
    },
  ];

  return columns;
}

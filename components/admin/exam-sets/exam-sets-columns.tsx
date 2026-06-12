"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  BookOpen,
  SchoolIcon,
  Calendar,
  Award,
  Clock,
  ClipboardList,
  Hash,
} from "lucide-react";
import { ExamSetWithSchool } from "@/hooks/admin/use-exam-sets-management";
import { ExamSetStatus } from "@/types/drizzle.types";
import { Badge } from "@/components/ui/badge";
import { toSentenceCase } from "@/lib/utils";

interface ExamSetsColumnsProps {
  updateExamSet: any;
  deleteExamSet: any;
  currentUserId?: string;
  t: any;
  tStatus: any;
}

export function createExamSetsColumns({
  updateExamSet,
  deleteExamSet,
  currentUserId,
  t,
  tStatus,
}: ExamSetsColumnsProps): ColumnDef<ExamSetWithSchool>[] {
  const getStatusBadge = (status: ExamSetStatus) => {
    const variants: Record<ExamSetStatus, "default" | "secondary" | "destructive"> = {
      draft: "secondary",
      published: "default",
      hidden: "destructive",
    };
    return <Badge variant={variants[status]}>{tStatus(status)}</Badge>;
  };

  const columns: ColumnDef<ExamSetWithSchool>[] = [
    {
      id: "spacer",
      header: () => null,
      cell: () => null,
      size: 48,
    },
    {
      accessorKey: "title",
      header: t("table.columns.title"),
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-semibold text-sm text-foreground truncate cursor-help">
                {toSentenceCase(row.original.title || "") || "N/A"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{toSentenceCase(row.original.title || "") || "N/A"}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
      size: 200,
    },
    {
      accessorKey: "subject",
      header: t("table.columns.subject"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">
              {toSentenceCase(row.original.subject || "")}
            </span>
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "schoolName",
      header: t("table.columns.school"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <SchoolIcon className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">
              {toSentenceCase(row.original.schoolName || "")}
            </span>
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "grade",
      header: t("table.columns.grade"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Award className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{row.original.grade}</span>
          </div>
        );
      },
      size: 80,
    },
    {
      accessorKey: "year",
      header: t("table.columns.year"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{row.original.year}</span>
          </div>
        );
      },
      size: 80,
    },
    {
      accessorKey: "semester",
      header: t("table.columns.semester"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">
              {toSentenceCase(row.original.semester || "")}
            </span>
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: "examType",
      header: t("table.columns.examType"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <ClipboardList className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">
              {toSentenceCase(row.original.examType || "")}
            </span>
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: "status",
      header: t("table.columns.status"),
      cell: ({ row }) => getStatusBadge(row.original.status),
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: t("table.columns.createdAt"),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt ?? "");
        return (
          <div className="flex items-center gap-2">
            <Hash className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{date.toLocaleDateString()}</span>
          </div>
        );
      },
      size: 120,
    },
    {
      id: "actions",
      header: "",
      size: 80,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => updateExamSet.mutate({ id: row.original.id, data: {} })}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              {t("actions.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteExamSet.mutate(row.original.id)}
              className="text-destructive"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {t("actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return columns;
}

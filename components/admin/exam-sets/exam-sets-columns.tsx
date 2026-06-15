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
  ArrowUpDownIcon,
} from "lucide-react";
import { ExamSetWithSchool } from "@/hooks/admin/use-exam-sets-management";
import { ExamSetStatus } from "@/types/drizzle.types";
import { Badge } from "@/components/ui/badge";
import { toSentenceCase, formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ExamSetsColumnsProps {
  onUpdate: (examSet: ExamSetWithSchool) => void;
  onDelete: (examSet: ExamSetWithSchool) => void;
  currentUserId?: string;
  t: ReturnType<typeof useTranslations<"ExamSets">>;
  tStatus: (status: ExamSetStatus) => string;
}

export function createExamSetsColumns({
  onUpdate,
  onDelete,
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.columns.title")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-semibold text-sm text-foreground whitespace-normal break-words cursor-help">
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.columns.subject")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.columns.school")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.columns.grade")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Award className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{row.original.grade}</span>
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.columns.year")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{row.original.year}</span>
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: "semester",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.columns.semester")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
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
      size: 120,
    },
    {
      accessorKey: "examType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.columns.examType")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.columns.status")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => getStatusBadge(row.original.status),
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.columns.createdAt")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <Hash className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate">
                  {formatDate(row.original.createdAt)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{formatDate(row.original.createdAt)}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
      size: 150,
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
            <DropdownMenuItem onClick={() => onUpdate(row.original)}>
              <PencilIcon className="h-4 w-4 mr-2" />
              {t("actions.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-destructive">
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

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, XIcon } from "lucide-react";
import { StudentCreateDialog } from "./student-create-dialog";

interface StudentsFiltersProps {
  search: string;
  approvalStatusFilter: string;
  branchFilter: string;
  schoolFilter: string;
  gradeFilter: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onApprovalStatusFilterChange: (value: string) => void;
  onBranchFilterChange: (value: string) => void;
  onSchoolFilterChange: (value: string) => void;
  onGradeFilterChange: (value: string) => void;
  onCreateStudent: (data: any) => void;
}

import { useTranslations } from "next-intl";

export function StudentsFilters({
  search,
  approvalStatusFilter,
  branchFilter,
  schoolFilter,
  gradeFilter,
  onSearchChange,
  onSearchSubmit,
  onApprovalStatusFilterChange,
  onBranchFilterChange,
  onSchoolFilterChange,
  onGradeFilterChange,
  onCreateStudent,
}: StudentsFiltersProps) {
  const t = useTranslations("StudentManagement");
  const tStatuses = useTranslations("Dashboard.statuses");

  const hasActiveFilters =
    (approvalStatusFilter && approvalStatusFilter !== "all") ||
    (branchFilter && branchFilter !== "all") ||
    (schoolFilter && schoolFilter !== "all") ||
    (gradeFilter && gradeFilter !== "all");

  const clearFilters = () => {
    onApprovalStatusFilterChange("all");
    onBranchFilterChange("all");
    onSchoolFilterChange("all");
    onGradeFilterChange("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchSubmit();
              }
            }}
            className="pl-9 pr-20"
          />
          <Button
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
            onClick={onSearchSubmit}
          >
            {t("search")}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <XIcon className="h-4 w-4 mr-2" />
              {t("filters.all")}
            </Button>
          )}
          <StudentCreateDialog onCreateStudent={onCreateStudent} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div className="w-full">
          <Select value={approvalStatusFilter} onValueChange={onApprovalStatusFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.status")} className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              <SelectItem value="pending">{tStatuses("pending")}</SelectItem>
              <SelectItem value="approved">{tStatuses("approved")}</SelectItem>
              <SelectItem value="rejected">{tStatuses("rejected")}</SelectItem>
              <SelectItem value="blocked">{tStatuses("blocked")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <Select value={gradeFilter} onValueChange={onGradeFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.grade")} className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                <SelectItem key={grade} value={grade.toString()}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

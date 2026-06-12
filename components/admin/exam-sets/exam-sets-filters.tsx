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
import { ExamSetCreateDialog } from "./exam-set-create-dialog";

interface ExamSetsFiltersProps {
  search: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onStatusFilterChange: (value: string) => void;
  onCreateExamSet: (data: any) => void;
}

import { useTranslations } from "next-intl";

export function ExamSetsFilters({
  search,
  statusFilter,
  onSearchChange,
  onSearchSubmit,
  onStatusFilterChange,
  onCreateExamSet,
}: ExamSetsFiltersProps) {
  const t = useTranslations("ExamSets");
  const tStatus = useTranslations("ExamSets.status");

  const hasActiveFilters = statusFilter && statusFilter !== "all";

  const clearFilters = () => {
    onStatusFilterChange("all");
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
              {t("allStatus")}
            </Button>
          )}
          <ExamSetCreateDialog onCreateExamSet={onCreateExamSet} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div className="w-full">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filterByStatus")} className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatus")}</SelectItem>
              <SelectItem value="draft">{tStatus("draft")}</SelectItem>
              <SelectItem value="published">{tStatus("published")}</SelectItem>
              <SelectItem value="hidden">{tStatus("hidden")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

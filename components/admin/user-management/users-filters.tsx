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

interface UsersFiltersProps {
  search: string;
  roleFilter: string;
  approvalStatusFilter: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onRoleFilterChange: (value: string) => void;
  onApprovalStatusFilterChange: (value: string) => void;
}

import { useTranslations } from "next-intl";

export function UsersFilters({
  search,
  roleFilter,
  approvalStatusFilter,
  onSearchChange,
  onSearchSubmit,
  onRoleFilterChange,
  onApprovalStatusFilterChange,
}: UsersFiltersProps) {
  const t = useTranslations("UserManagement");
  const tRoles = useTranslations("Dashboard.roles");

  const hasActiveFilters =
    (roleFilter && roleFilter !== "all") ||
    (approvalStatusFilter && approvalStatusFilter !== "all");

  const clearFilters = () => {
    onRoleFilterChange("all");
    onApprovalStatusFilterChange("all");
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
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t("filters.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              <SelectItem value="super_admin">{tRoles("super_admin")}</SelectItem>
              <SelectItem value="branch_admin">{tRoles("branch_admin")}</SelectItem>
              <SelectItem value="teacher">{tRoles("teacher")}</SelectItem>
              <SelectItem value="student">{tRoles("student")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={approvalStatusFilter} onValueChange={onApprovalStatusFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t("filters.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              <SelectItem value="pending">{t("filters.pending")}</SelectItem>
              <SelectItem value="approved">{t("filters.approved")}</SelectItem>
              <SelectItem value="rejected">{t("filters.rejected")}</SelectItem>
              <SelectItem value="blocked">{t("filters.blocked")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

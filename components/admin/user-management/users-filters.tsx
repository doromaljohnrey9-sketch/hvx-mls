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

export function UsersFilters({
  search,
  roleFilter,
  approvalStatusFilter,
  onSearchChange,
  onSearchSubmit,
  onRoleFilterChange,
  onApprovalStatusFilterChange,
}: UsersFiltersProps) {
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
            placeholder="Search users..."
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
            Search
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <XIcon className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="branch_admin">Branch Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
          <Select value={approvalStatusFilter} onValueChange={onApprovalStatusFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

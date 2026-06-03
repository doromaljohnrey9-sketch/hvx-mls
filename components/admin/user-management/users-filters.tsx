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
import { SearchIcon } from "lucide-react";

interface UsersFiltersProps {
  search: string;
  roleFilter: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onRoleFilterChange: (value: string) => void;
}

export function UsersFilters({
  search,
  roleFilter,
  onSearchChange,
  onSearchSubmit,
  onRoleFilterChange,
}: UsersFiltersProps) {
  return (
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
      <div className="flex gap-4">
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="branch_admin">Branch Admin</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

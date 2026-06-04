"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDownIcon } from "lucide-react";

import type { AdminUser, AdminUserUpdate } from "@/types/admin.types";
import type { UserRole } from "@/types/drizzle.types";

interface CreateUsersColumnsProps {
  updateUser: {
    mutate: (data: { id: string; updates: AdminUserUpdate }) => void;
    isPending?: boolean;
  };
}

export function createUsersColumns({ updateUser }: CreateUsersColumnsProps) {
  const ROLE_LABELS: Record<string, string> = {
    pending: "Pending",
    denied: "Denied",
    blocked: "Blocked",
    student: "Student",
    teacher: "Teacher",
    branch_admin: "Branch Admin",
    super_admin: "Super Admin",
  };

  const columns: ColumnDef<AdminUser>[] = [
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
          Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{user.name || "N/A"}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        );
      },
      size: 260,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Role
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
            {ROLE_LABELS[user.role] || user.role}
          </span>
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
          Branch
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-sm">{user.branchName || "N/A"}</span>
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
          Joined
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        if (!user.createdAt) return "N/A";
        return new Date(user.createdAt).toLocaleDateString();
      },
      size: 140,
    },
    {
      id: "actions",
      header: () => <div className="text-sm font-medium">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;
        const hasAction = user.role !== "super_admin" && user.role !== "branch_admin";

        if (!hasAction) {
          return null;
        }

        const availableRoles: UserRole[] = [
          "pending",
          "denied",
          "blocked",
          "student",
          "teacher",
          "branch_admin",
        ];

        return (
          <Select
            defaultValue={user.role}
            onValueChange={(newRole: UserRole) => {
              updateUser.mutate({
                id: user.id,
                updates: { role: newRole },
              });
              toast.success(`User role updated to ${ROLE_LABELS[newRole]}`);
            }}
            disabled={updateUser.isPending}
          >
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
      size: 160,
    },
  ];

  return columns;
}

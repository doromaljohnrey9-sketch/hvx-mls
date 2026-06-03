"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDownIcon, MoreHorizontalIcon } from "lucide-react";

import type { AdminUser, AdminUserUpdate } from "@/types/admin.types";

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

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user.role !== "super_admin" && user.role !== "branch_admin" && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      updateUser.mutate({
                        id: user.id,
                        updates: {
                          role: user.role === "student" ? "pending" : "student",
                        },
                      });
                      toast.success(
                        user.role === "student"
                          ? "User role updated to pending"
                          : "User approved as student"
                      );
                    }}
                  >
                    {user.role === "student" ? "Revoke" : "Approve"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      updateUser.mutate({
                        id: user.id,
                        updates: {
                          role: "denied",
                        },
                      });
                      toast.success("User denied");
                    }}
                  >
                    Deny
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      updateUser.mutate({
                        id: user.id,
                        updates: {
                          role: "blocked",
                        },
                      });
                      toast.success("User blocked");
                    }}
                  >
                    Block
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 80,
    },
  ];

  return columns;
}

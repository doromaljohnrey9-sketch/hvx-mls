"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDownIcon,
  GraduationCap,
  Shield,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Calendar,
  User,
  MoreHorizontalIcon,
} from "lucide-react";

import type { AdminUser, AdminUserUpdate } from "@/types/admin.types";
import type { UserRole, ApprovalStatus } from "@/types/drizzle.types";
import { formatDate } from "@/lib/utils";

interface CreateUsersColumnsProps {
  updateUser: {
    mutate: (data: { id: string; updates: AdminUserUpdate }) => void;
    isPending?: boolean;
  };
  currentUserId?: string;
}

export function createUsersColumns({ updateUser, currentUserId }: CreateUsersColumnsProps) {
  const ROLE_LABELS: Record<string, string> = {
    student: "Student",
    teacher: "Teacher",
    branch_admin: "Branch Admin",
    super_admin: "Super Admin",
  };

  const ROLE_ICONS: Record<string, React.ReactNode> = {
    student: <GraduationCap className="size-3" />,
    teacher: <GraduationCap className="size-3" />,
    branch_admin: <Building className="size-3" />,
    super_admin: <Shield className="size-3" />,
  };

  const APPROVAL_STATUS_LABELS: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    blocked: "Blocked",
  };

  const STATUS_ICONS: Record<string, React.ReactNode> = {
    pending: <Clock className="size-3" />,
    approved: <CheckCircle className="size-3" />,
    rejected: <XCircle className="size-3" />,
    blocked: <Ban className="size-3" />,
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
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-foreground truncate">
                {user.name || "N/A"}
              </span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
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
          <Badge variant="secondary">
            {ROLE_ICONS[user.role]}
            {ROLE_LABELS[user.role] || user.role}
          </Badge>
        );
      },
      size: 160,
    },
    {
      accessorKey: "approvalStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Status
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          pending: "secondary",
          approved: "default",
          rejected: "destructive",
          blocked: "outline",
        };
        return (
          <Badge variant={statusVariant[user.approvalStatus] || "secondary"}>
            {STATUS_ICONS[user.approvalStatus]}
            {APPROVAL_STATUS_LABELS[user.approvalStatus] || user.approvalStatus}
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
          Branch
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Building className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{user.branchName || "N/A"}</span>
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
        return (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {formatDate(user.createdAt)}
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
          Approved By
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{user.approverName || "N/A"}</span>
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
          Approved At
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {formatDate(user.approvedAt)}
            </span>
          </div>
        );
      },
      size: 140,
    },
    {
      id: "actions",
      header: () => <div className="text-sm font-semibold text-foreground">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;
        const hasAction = user.role !== "super_admin" && user.role !== "branch_admin";
        const isSelf = currentUserId === user.id;

        if (!hasAction) {
          return null;
        }

        const [selectedRole, setSelectedRole] = useState<UserRole | null>(user.role);
        const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus | null>(
          user.approvalStatus
        );
        const [isOpen, setIsOpen] = useState(false);

        const availableRoles: UserRole[] = ["student", "teacher", "branch_admin"];
        const availableStatuses: ApprovalStatus[] = ["pending", "approved", "rejected", "blocked"];

        const handleConfirm = () => {
          const updates: AdminUserUpdate = {};
          let hasChanges = false;

          if (selectedRole && selectedRole !== user.role) {
            updates.role = selectedRole;
            hasChanges = true;
          }
          if (selectedStatus && selectedStatus !== user.approvalStatus) {
            updates.approvalStatus = selectedStatus;
            hasChanges = true;
          }

          if (hasChanges) {
            updateUser.mutate({
              id: user.id,
              updates,
            });
            if (updates.role) {
              toast.success(`User role updated to ${ROLE_LABELS[updates.role]}`);
            }
            if (updates.approvalStatus) {
              toast.success(
                `User status updated to ${APPROVAL_STATUS_LABELS[updates.approvalStatus]}`
              );
            }
          }
          setIsOpen(false);
        };

        return (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={updateUser.isPending || isSelf}
              >
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Role</DropdownMenuLabel>
              {availableRoles.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={selectedRole === role}
                  onCheckedChange={(checked) => checked && setSelectedRole(role)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {ROLE_LABELS[role]}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {availableStatuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatus === status}
                  onCheckedChange={(checked) => checked && setSelectedStatus(status)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {APPROVAL_STATUS_LABELS[status]}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <div className="flex items-center justify-end gap-2 p-2">
                <Button size="sm" onClick={handleConfirm} disabled={updateUser.isPending}>
                  Confirm
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 80,
    },
  ];

  return columns;
}

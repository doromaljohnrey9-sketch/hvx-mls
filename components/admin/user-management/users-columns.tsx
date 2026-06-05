"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserActionsDropdown } from "@/components/admin/user-management/user-actions-dropdown";
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
  SchoolIcon,
} from "lucide-react";

import type { AdminUser, AdminUserUpdate } from "@/types/admin.types";
import type { UserRole, ApprovalStatus } from "@/types/drizzle.types";
import { formatDate } from "@/lib/utils";

import { useTranslations } from "next-intl";

interface CreateUsersColumnsProps {
  updateUser: {
    mutate: (data: { id: string; updates: AdminUserUpdate }) => void;
    isPending?: boolean;
  };
  currentUserId?: string;
  t: ReturnType<typeof useTranslations<"UserManagement">>;
  tRoles: ReturnType<typeof useTranslations<"Dashboard.roles">>;
  tFilters: ReturnType<typeof useTranslations<"UserManagement.filters">>;
}

export function createUsersColumns({
  updateUser,
  currentUserId,
  t,
  tRoles,
  tFilters,
}: CreateUsersColumnsProps) {
  const ROLE_LABELS: Record<string, string> = {
    student: tRoles("student"),
    teacher: tRoles("teacher"),
    branch_admin: tRoles("branch_admin"),
    super_admin: tRoles("super_admin"),
  };

  const ROLE_ICONS: Record<string, React.ReactNode> = {
    student: <GraduationCap className="size-3" />,
    teacher: <GraduationCap className="size-3" />,
    branch_admin: <Building className="size-3" />,
    super_admin: <Shield className="size-3" />,
  };

  const APPROVAL_STATUS_LABELS: Record<string, string> = {
    pending: tFilters("pending"),
    approved: tFilters("approved"),
    rejected: tFilters("rejected"),
    blocked: tFilters("blocked"),
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
          {t("table.name")}
          <ArrowUpDownIcon className="ml-2 size-4" />
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
          {t("table.role")}
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
          {t("table.status")}
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
          {t("table.branch")}
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
      accessorKey: "schoolName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.school")}
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <SchoolIcon className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{user.schoolName || "N/A"}</span>
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
          {t("table.joined")}
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
          {t("table.approvedBy")}
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
          {t("table.approvedAt")}
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
      header: () => <div className="text-sm font-semibold text-foreground">{t("table.actions")}</div>,
      cell: ({ row }) => {
        const user = row.original;
        const hasAction = user.role !== "super_admin" && user.role !== "branch_admin";
        const isSelf = currentUserId === user.id;

        if (!hasAction) {
          return null;
        }

        return (
          <UserActionsDropdown
            user={user}
            updateUser={updateUser}
            isSelf={isSelf}
            roleLabels={ROLE_LABELS}
            statusLabels={APPROVAL_STATUS_LABELS}
          />
        );
      },
      size: 80,
    },
  ];

  return columns;
}

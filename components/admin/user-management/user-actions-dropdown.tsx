"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";

import type { AdminUser, AdminUserUpdate } from "@/types/admin.types";
import type { UserRole, ApprovalStatus } from "@/types/drizzle.types";

interface UserActionsDropdownProps {
  user: AdminUser;
  updateUser: {
    mutate: (data: { id: string; updates: AdminUserUpdate }) => void;
    isPending?: boolean;
  };
  isSelf: boolean;
  roleLabels: Record<string, string>;
  statusLabels: Record<string, string>;
}

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teacher: "Teacher",
  branch_admin: "Branch Admin",
  super_admin: "Super Admin",
};

const APPROVAL_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  blocked: "Blocked",
};

export function UserActionsDropdown({
  user,
  updateUser,
  isSelf,
  roleLabels = ROLE_LABELS,
  statusLabels = APPROVAL_STATUS_LABELS,
}: UserActionsDropdownProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(user.role);
  const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus | null>(user.approvalStatus);
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
        toast.success(`User role updated to ${roleLabels[updates.role]}`);
      }
      if (updates.approvalStatus) {
        toast.success(`User status updated to ${statusLabels[updates.approvalStatus]}`);
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
            {roleLabels[role]}
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
            {statusLabels[status]}
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
}

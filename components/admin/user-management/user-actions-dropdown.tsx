"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, PencilIcon, KeyIcon } from "lucide-react";

import type { AdminUser, AdminUserUpdate } from "@/types/admin.types";
import { UserEditDialog } from "@/components/admin/user-management/user-edit-dialog";
import { UserResetPasswordDialog } from "@/components/admin/user-management/user-reset-password-dialog";

interface UserActionsDropdownProps {
  user: AdminUser;
  updateUser: {
    mutate: (data: { id: string; updates: AdminUserUpdate }) => void;
    isPending?: boolean;
  };
  resetPassword?: {
    mutate: (data: { id: string; password: string }) => void;
    isPending?: boolean;
  };
  isSelf: boolean;
}

import { useTranslations } from "next-intl";

export function UserActionsDropdown({
  user,
  updateUser,
  resetPassword,
  isSelf,
}: UserActionsDropdownProps) {
  const t = useTranslations("UserManagement");
  const [isOpen, setIsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);

  return (
    <>
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
          <DropdownMenuItem
            onClick={() => {
              setResetPasswordDialogOpen(true);
              setIsOpen(false);
            }}
            disabled={!resetPassword || updateUser.isPending || isSelf}
          >
            <KeyIcon className="size-4 mr-2" />
            {t("table.resetPassword")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setEditDialogOpen(true);
              setIsOpen(false);
            }}
            disabled={updateUser.isPending}
          >
            <PencilIcon className="size-4 mr-2" />
            {t("table.edit")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserEditDialog
        user={user}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateUser={updateUser.mutate}
        isPending={updateUser.isPending}
      />
      {resetPassword && (
        <UserResetPasswordDialog
          user={user}
          open={resetPasswordDialogOpen}
          onOpenChange={setResetPasswordDialogOpen}
          onResetPassword={resetPassword.mutate}
          isPending={resetPassword.isPending}
        />
      )}
    </>
  );
}

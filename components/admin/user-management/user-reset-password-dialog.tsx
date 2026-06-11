"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/shared/password-input";

import type { AdminUser } from "@/types/admin.types";

import { useTranslations } from "next-intl";

interface UserResetPasswordDialogProps {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResetPassword: (data: { id: string; password: string }) => void;
  isPending?: boolean;
}

const resetPasswordSchema = {
  password: "",
  confirmPassword: "",
};

export function UserResetPasswordDialog({
  user,
  open,
  onOpenChange,
  onResetPassword,
  isPending,
}: UserResetPasswordDialogProps) {
  const t = useTranslations("UserManagement");
  const form = useForm({
    defaultValues: resetPasswordSchema,
  });

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error(t("toasts.passwordsDoNotMatch"));
      return;
    }

    if (data.password.length < 6) {
      toast.error(t("toasts.passwordMinLength"));
      return;
    }

    onResetPassword({
      id: user.id,
      password: data.password,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("resetPassword.title")}</DialogTitle>
          <DialogDescription>
            {t("resetPassword.description")} {user.email}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>{t("fields.password")}</FieldLabel>
              <PasswordInput
                {...form.register("password", { required: true, minLength: 6 })}
                placeholder={t("placeholders.password")}
              />
              {form.formState.errors.password && (
                <FieldError errors={[form.formState.errors.password as any]} />
              )}
            </Field>

            <Field>
              <FieldLabel>{t("fields.confirmPassword")}</FieldLabel>
              <PasswordInput
                {...form.register("confirmPassword", { required: true })}
                placeholder={t("placeholders.confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <FieldError errors={[form.formState.errors.confirmPassword as any]} />
              )}
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t("resetPassword.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

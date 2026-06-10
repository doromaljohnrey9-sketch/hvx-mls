"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/shared/password-input";

import { getBranchesQueryOptions } from "@/queries/branches.query";
import { getSchoolsQueryOptions } from "@/queries/schools.query";
import { getTeachersQueryOptions } from "@/queries/teachers.query";
import type { UserRole, ApprovalStatus } from "@/types/drizzle.types";

import { useTranslations } from "next-intl";

const userCreateSchema = {
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
  role: "student",
  branchId: "none",
  schoolId: "none",
  grade: "",
  assignedTeacher: "none",
  approvalStatus: "approved",
};

export function UserCreateDialog({ onCreateUser }: { onCreateUser: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("UserManagement");

  const form = useForm({
    defaultValues: userCreateSchema,
  });

  const { data: branches } = useQuery(getBranchesQueryOptions());
  const { data: schools } = useQuery(getSchoolsQueryOptions());
  const { data: teachers } = useQuery(
    getTeachersQueryOptions(
      form.watch("branchId") && form.watch("branchId") !== "none"
        ? form.watch("branchId")
        : undefined,
      form.watch("schoolId") && form.watch("schoolId") !== "none"
        ? form.watch("schoolId")
        : undefined
    )
  );

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role as UserRole,
      branchId: data.branchId === "none" ? undefined : data.branchId,
      schoolId: data.schoolId === "none" ? undefined : data.schoolId,
      grade: data.grade ? parseInt(data.grade) : undefined,
      assignedTeacher: data.assignedTeacher === "none" ? undefined : data.assignedTeacher,
      approvalStatus: data.approvalStatus as ApprovalStatus,
    };
    onCreateUser(payload);
    form.reset();
    setOpen(false);
  };

  const tRoles = useTranslations("Dashboard.roles");
  const tStatuses = useTranslations("Dashboard.statuses");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t("createUser")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createUserTitle")}</DialogTitle>
          <DialogDescription>{t("createUserDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>{t("fields.email")}</FieldLabel>
              <Input
                {...form.register("email", { required: true })}
                type="email"
                placeholder={t("placeholders.email")}
              />
              {form.formState.errors.email && (
                <FieldError errors={[form.formState.errors.email as any]} />
              )}
            </Field>

            <Field>
              <FieldLabel>{t("fields.name")}</FieldLabel>
              <Input
                {...form.register("name", { required: true })}
                placeholder={t("placeholders.name")}
              />
              {form.formState.errors.name && (
                <FieldError errors={[form.formState.errors.name as any]} />
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t("fields.role")}</FieldLabel>
                <Select
                  {...form.register("role")}
                  onValueChange={(value) => form.setValue("role", value)}
                  defaultValue="student"
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholders.role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">{tRoles("student")}</SelectItem>
                    <SelectItem value="teacher">{tRoles("teacher")}</SelectItem>
                    <SelectItem value="super_admin">{tRoles("super_admin")}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>{t("fields.approvalStatus")}</FieldLabel>
                <Select
                  {...form.register("approvalStatus")}
                  onValueChange={(value) => form.setValue("approvalStatus", value)}
                  defaultValue="pending"
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholders.approvalStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{tStatuses("pending")}</SelectItem>
                    <SelectItem value="approved">{tStatuses("approved")}</SelectItem>
                    <SelectItem value="rejected">{tStatuses("rejected")}</SelectItem>
                    <SelectItem value="blocked">{tStatuses("blocked")}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>{t("fields.branch")}</FieldLabel>
              <Select
                {...form.register("branchId")}
                onValueChange={(value) => form.setValue("branchId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("placeholders.branch")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("placeholders.noBranch")}</SelectItem>
                  {branches?.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>{t("fields.school")}</FieldLabel>
              <Select
                {...form.register("schoolId")}
                onValueChange={(value) => form.setValue("schoolId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("placeholders.school")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("placeholders.noSchool")}</SelectItem>
                  {schools?.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t("fields.grade")}</FieldLabel>
                <Input
                  {...form.register("grade")}
                  type="number"
                  placeholder={t("placeholders.grade")}
                />
              </Field>

              <Field>
                <FieldLabel>{t("fields.assignedTeacher")}</FieldLabel>
                <Select
                  {...form.register("assignedTeacher")}
                  onValueChange={(value) => form.setValue("assignedTeacher", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholders.assignedTeacher")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("placeholders.noTeacher")}</SelectItem>
                    {teachers?.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.name}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("create")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

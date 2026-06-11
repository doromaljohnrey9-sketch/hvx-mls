"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { getBranchesQueryOptions } from "@/queries/branches.query";
import { getSchoolsQueryOptions } from "@/queries/schools.query";
import { getTeachersQueryOptions } from "@/queries/teachers.query";
import type { AdminUser, AdminUserUpdate } from "@/types/admin.types";
import type { UserRole, ApprovalStatus } from "@/types/drizzle.types";

import { useTranslations } from "next-intl";

interface UserEditDialogProps {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: (data: { id: string; updates: AdminUserUpdate }) => void;
  isPending?: boolean;
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onUpdateUser,
  isPending,
}: UserEditDialogProps) {
  const [branchOpen, setBranchOpen] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const t = useTranslations("UserManagement");

  const form = useForm({
    defaultValues: {
      name: user.name || "",
      role: user.role,
      approvalStatus: user.approvalStatus,
      branchId: user.branchId || "none",
      schoolId: user.schoolId || "none",
      grade: user.grade?.toString() || "",
      assignedTeacher: user.assignedTeacher || "none",
    },
  });

  useEffect(() => {
    form.reset({
      name: user.name || "",
      role: user.role,
      approvalStatus: user.approvalStatus,
      branchId: user.branchId || "none",
      schoolId: user.schoolId || "none",
      grade: user.grade?.toString() || "",
      assignedTeacher: user.assignedTeacher || "none",
    });
  }, [user, form]);

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
    const updates: AdminUserUpdate = {};

    if (data.name !== user.name) {
      updates.name = data.name;
    }
    if (data.role !== user.role) {
      updates.role = data.role as UserRole;
    }
    if (data.approvalStatus !== user.approvalStatus) {
      updates.approvalStatus = data.approvalStatus as ApprovalStatus;
    }
    if (data.branchId !== (user.branchId || "none")) {
      updates.branchId = data.branchId === "none" ? null : data.branchId;
    }
    if (data.schoolId !== (user.schoolId || "none")) {
      updates.schoolId = data.schoolId === "none" ? null : data.schoolId;
    }
    if (data.grade !== (user.grade?.toString() || "")) {
      updates.grade = data.grade ? parseInt(data.grade) : null;
    }
    if (data.assignedTeacher !== (user.assignedTeacher || "none")) {
      updates.assignedTeacher = data.assignedTeacher === "none" ? null : data.assignedTeacher;
    }

    onUpdateUser({
      id: user.id,
      updates,
    });
    toast.success(t("toasts.updated"), {
      description: t("toasts.updatedDesc"),
    });
    onOpenChange(false);
  };

  const tRoles = useTranslations("Dashboard.roles");
  const tStatuses = useTranslations("Dashboard.statuses");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editUserTitle")}</DialogTitle>
          <DialogDescription>{t("editUserDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
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
                <FieldLabel>{t("fields.role")}</FieldLabel>
                <Select
                  value={form.watch("role")}
                  onValueChange={(value: UserRole) => form.setValue("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholders.role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">{tRoles("student")}</SelectItem>
                    <SelectItem value="teacher">{tRoles("teacher")}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>{t("fields.approvalStatus")}</FieldLabel>
                <Select
                  value={form.watch("approvalStatus")}
                  onValueChange={(value: ApprovalStatus) => form.setValue("approvalStatus", value)}
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
              <Popover modal={true} open={branchOpen} onOpenChange={setBranchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !form.watch("branchId") || form.watch("branchId") === "none"
                        ? "text-muted-foreground"
                        : ""
                    )}
                  >
                    {form.watch("branchId") && form.watch("branchId") !== "none"
                      ? branches?.find((branch) => branch.id === form.watch("branchId"))?.name
                      : t("placeholders.branch")}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder={t("placeholders.branch")} />
                    <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                      <CommandEmpty>{t("placeholders.noBranch")}</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="none"
                          onSelect={() => {
                            form.setValue("branchId", "none");
                            form.setValue("schoolId", "none");
                            setBranchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              !form.watch("branchId") || form.watch("branchId") === "none"
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {t("placeholders.noBranch")}
                        </CommandItem>
                        {branches?.map((branch) => (
                          <CommandItem
                            key={branch.id}
                            value={branch.name}
                            onSelect={() => {
                              form.setValue("branchId", branch.id);
                              form.setValue("schoolId", "none");
                              setBranchOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.watch("branchId") === branch.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="truncate">{branch.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </Field>

            <Field>
              <FieldLabel>{t("fields.school")}</FieldLabel>
              <Popover modal={true} open={schoolOpen} onOpenChange={setSchoolOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !form.watch("schoolId") || form.watch("schoolId") === "none"
                        ? "text-muted-foreground"
                        : ""
                    )}
                  >
                    {form.watch("schoolId") && form.watch("schoolId") !== "none" ? (
                      <span className="truncate">
                        {schools?.find((school) => school.id === form.watch("schoolId"))?.name}
                      </span>
                    ) : (
                      t("placeholders.school")
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder={t("placeholders.school")} />
                    <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                      <CommandEmpty>{t("placeholders.noSchool")}</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="none"
                          onSelect={() => {
                            form.setValue("schoolId", "none");
                            setSchoolOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              !form.watch("schoolId") || form.watch("schoolId") === "none"
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {t("placeholders.noSchool")}
                        </CommandItem>
                        {schools?.map((school) => (
                          <CommandItem
                            key={school.id}
                            value={school.name}
                            onSelect={() => {
                              form.setValue("schoolId", school.id);
                              setSchoolOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.watch("schoolId") === school.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="truncate">{school.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
                <Popover modal={true} open={teacherOpen} onOpenChange={setTeacherOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !form.watch("assignedTeacher") || form.watch("assignedTeacher") === "none"
                          ? "text-muted-foreground"
                          : ""
                      )}
                    >
                      {form.watch("assignedTeacher") && form.watch("assignedTeacher") !== "none" ? (
                        <span className="truncate">{form.watch("assignedTeacher")}</span>
                      ) : (
                        t("placeholders.assignedTeacher")
                      )}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder={t("placeholders.assignedTeacher")} />
                      <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        <CommandEmpty>{t("placeholders.noTeacher")}</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              form.setValue("assignedTeacher", "none");
                              setTeacherOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                !form.watch("assignedTeacher") ||
                                  form.watch("assignedTeacher") === "none"
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {t("placeholders.noTeacher")}
                          </CommandItem>
                          {teachers?.map((teacher) => (
                            <CommandItem
                              key={teacher.id}
                              value={teacher.name}
                              onSelect={() => {
                                form.setValue("assignedTeacher", teacher.name);
                                setTeacherOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.watch("assignedTeacher") === teacher.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span className="truncate">{teacher.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

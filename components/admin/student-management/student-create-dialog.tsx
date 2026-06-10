"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusIcon, Check, ChevronDown } from "lucide-react";

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
import { PasswordInput } from "@/components/shared/password-input";
import { cn } from "@/lib/utils";

import { getBranchesQueryOptions } from "@/queries/branches.query";
import { getSchoolsQueryOptions } from "@/queries/schools.query";
import { getTeachersQueryOptions } from "@/queries/teachers.query";
import type { ApprovalStatus } from "@/types/drizzle.types";

import { useTranslations } from "next-intl";

const studentCreateSchema = {
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
  branchId: "none",
  schoolId: "none",
  grade: "",
  assignedTeacher: "none",
  approvalStatus: "approved",
};

export function StudentCreateDialog({ onCreateStudent }: { onCreateStudent: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const t = useTranslations("StudentManagement");

  const form = useForm({
    defaultValues: studentCreateSchema,
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
      role: "student",
      branchId: data.branchId === "none" ? undefined : data.branchId,
      schoolId: data.schoolId === "none" ? undefined : data.schoolId,
      grade: data.grade ? parseInt(data.grade) : undefined,
      assignedTeacher: data.assignedTeacher === "none" ? undefined : data.assignedTeacher,
      approvalStatus: data.approvalStatus as ApprovalStatus,
    };
    onCreateStudent(payload);
    form.reset();
    setOpen(false);
  };

  const tStatuses = useTranslations("Dashboard.statuses");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t("createStudent")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createStudentTitle")}</DialogTitle>
          <DialogDescription>{t("createStudentDescription")}</DialogDescription>
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
                <Select
                  {...form.register("grade")}
                  onValueChange={(value) => form.setValue("grade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholders.grade")} />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

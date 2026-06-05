"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { User, Mail, Lock, GraduationCap, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PasswordInput } from "@/components/shared/password-input";

import { getSupabaseClient } from "@/lib/supabase/client";

import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";

import { AUTH_ROUTES } from "@/constants/routes.constant";
import { getBranchesQueryOptions } from "@/queries/branches.query";
import { getSchoolsQueryOptions } from "@/queries/schools.query";
import { getTeachersQueryOptions } from "@/queries/teachers.query";

import { useTranslations } from "next-intl";

export const PageClient = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [isPending, startTransition] = useTransition();

  const { data: branches, isLoading: branchesLoading } = useQuery(getBranchesQueryOptions());
  const { data: schools, isLoading: schoolsLoading } = useQuery(getSchoolsQueryOptions());

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      branchId: "none",
      schoolId: "none",
      grade: "none",
      assignedTeacher: "none",
    },
  });

  // Auto-select branch when school is selected
  const schoolId = form.watch("schoolId");
  const branchId = form.watch("branchId");

  const { data: teachers, isLoading: teachersLoading } = useQuery(
    getTeachersQueryOptions(
      branchId && branchId !== "none" ? branchId : undefined,
      schoolId && schoolId !== "none" ? schoolId : undefined
    )
  );
  useEffect(() => {
    if (schoolId && schoolId !== "none" && schools) {
      const selectedSchool = schools.find((s) => s.id === schoolId);
      if (selectedSchool?.branchId) {
        form.setValue("branchId", selectedSchool.branchId);
      }
    }
  }, [schoolId, schools, form]);

  // Reset assigned teacher when branch or school changes
  useEffect(() => {
    form.setValue("assignedTeacher", "none");
  }, [branchId, schoolId, form]);

  const onFormSubmit = (values: RegisterFormValues) => {
    startTransition(async () => {
      try {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name,
              ...(values.branchId && values.branchId !== "none" && { branchId: values.branchId }),
              ...(values.schoolId && values.schoolId !== "none" && { schoolId: values.schoolId }),
              ...(values.grade && { grade: values.grade }),
              ...(values.assignedTeacher &&
                values.assignedTeacher !== "none" && { assignedTeacher: values.assignedTeacher }),
            },
          },
        });

        if (error) {
          toast.error(t("register.failed"), {
            description: error.message,
          });
          return;
        }

        toast.success(t("register.success"), {
          description: t("register.successDesc"),
        });

        form.reset();
        router.push(AUTH_ROUTES.LOGIN);
      } catch (error) {
        console.error(error);
        toast.error(t("common.somethingWentWrong"), {
          description: t("common.tryAgain"),
        });
      }
    });
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left: Placeholder image panel */}
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <Link
          href="/"
          className="absolute left-6 top-6 flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors z-10"
        >
          <ArrowLeft className="size-4" />
          {t("common.backToHome")}
        </Link>
        <div className="absolute inset-0 flex items-center justify-center">
          <AspectRatio ratio={16 / 9} className="w-full max-w-md"></AspectRatio>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent" />
      </div>

      {/* Right: Form panel */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("register.title")}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{t("register.subtitle")}</p>
          </div>

          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("register.accountInfo")}
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2 sm:col-span-2">
                      <FieldLabel htmlFor="name">{t("common.name")}</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <User className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          id="name"
                          type="text"
                          placeholder={t("common.placeholderName")}
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                        />
                      </InputGroup>
                      {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                    </div>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2 sm:col-span-2">
                      <FieldLabel htmlFor="email">{t("common.email")}</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <Mail className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          id="email"
                          type="email"
                          placeholder={t("common.placeholderEmail")}
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                        />
                      </InputGroup>
                      {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                    </div>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <FieldLabel htmlFor="password">{t("common.password")}</FieldLabel>
                      <PasswordInput
                        {...field}
                        id="password"
                        placeholder={t("common.placeholderNewPassword")}
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
                      />
                      {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                    </div>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <FieldLabel htmlFor="confirmPassword">{t("common.confirmPassword")}</FieldLabel>
                      <PasswordInput
                        {...field}
                        id="confirmPassword"
                        placeholder={t("common.placeholderConfirmPassword")}
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
                      />
                      {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Organization Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("register.orgDetails")}
                <span className="ml-1 font-normal normal-case text-muted-foreground/60">
                  — {t("register.optional")}
                </span>
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="branchId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <FieldLabel htmlFor="branchId">{t("register.branch")}</FieldLabel>
                      <Select
                        {...field}
                        value={field.value || "none"}
                        onValueChange={(value) => {
                          field.onChange(value === "none" ? null : value);
                          form.setValue("schoolId", "none");
                        }}
                        disabled={isPending || branchesLoading}
                      >
                        <SelectTrigger
                          id="branchId"
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder={t("register.selectBranch")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("register.none")}</SelectItem>
                          {branches?.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                    </div>
                  )}
                />

                <Controller
                  name="schoolId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <FieldLabel htmlFor="schoolId">{t("register.school")}</FieldLabel>
                      <Select
                        {...field}
                        value={field.value || "none"}
                        onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                        disabled={isPending || schoolsLoading}
                      >
                        <SelectTrigger
                          id="schoolId"
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder={t("register.selectSchool")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("register.none")}</SelectItem>
                          {schools
                            ?.filter(
                              (school) =>
                                !branchId || branchId === "none" || school.branchId === branchId
                            )
                            .map((school) => (
                              <SelectItem key={school.id} value={school.id}>
                                {school.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                    </div>
                  )}
                />

                <Controller
                  name="grade"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <FieldLabel htmlFor="grade">{t("register.grade")}</FieldLabel>
                      <Select
                        {...field}
                        value={field.value ? field.value.toString() : "none"}
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? null : parseInt(value, 10))
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger
                          id="grade"
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder={t("register.selectGrade")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("register.none")}</SelectItem>
                          <SelectItem value="1">{t("register.gradeLabel", { n: 1 })}</SelectItem>
                          <SelectItem value="2">{t("register.gradeLabel", { n: 2 })}</SelectItem>
                          <SelectItem value="3">{t("register.gradeLabel", { n: 3 })}</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                    </div>
                  )}
                />

                <Controller
                  name="assignedTeacher"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <FieldLabel htmlFor="assignedTeacher">{t("register.teacher")}</FieldLabel>
                      <Select
                        {...field}
                        value={field.value || "none"}
                        onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                        disabled={isPending || teachersLoading}
                      >
                        <SelectTrigger
                          id="assignedTeacher"
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder={t("register.selectTeacher")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("register.none")}</SelectItem>
                          {teachers?.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.name}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                    </div>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="w-full" size="lg">
              {isPending ? t("common.creatingAccount") : t("register.requestApproval")}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t("register.haveAccount")}{" "}
                <Link
                  href={AUTH_ROUTES.LOGIN}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {t("common.login")}
                </Link>
              </p>
              <p className="mt-3 text-xs text-muted-foreground/60">
                {t.rich("common.agreementSignup", {
                  terms: (chunks) => (
                    <Link href="#" className="underline hover:text-muted-foreground">
                      {t("common.terms")}
                    </Link>
                  ),
                  privacy: (chunks) => (
                    <Link href="#" className="underline hover:text-muted-foreground">
                      {t("common.privacyPolicy")}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

"use client";

import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { useTransition } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Mail, Lock, GraduationCap, ArrowLeft, Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
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
import { PasswordInput } from "@/components/shared/password-input";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { cn } from "@/lib/utils";

import { getSupabaseClient } from "@/lib/supabase/client";

import { getAuthSchemas, type RegisterFormValues } from "@/schemas/auth.schema";

import { AUTH_ROUTES } from "@/constants/routes.constant";
import { getBranchesQueryOptions } from "@/queries/branches.query";
import { getSchoolsQueryOptions } from "@/queries/schools.query";
import { schoolsService } from "@/services/schools.service";

import { useTranslations } from "next-intl";

export const PageClient = () => {
  const t = useTranslations("Auth");
  const { registerSchema } = getAuthSchemas(t);
  const router = useRouter();
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();
  const [branchOpen, setBranchOpen] = useState(false);

  const { data: branches, isLoading: branchesLoading } = useQuery(getBranchesQueryOptions());
  const { data: schools, isLoading: schoolsLoading } = useQuery(getSchoolsQueryOptions());

  const createSchoolMutation = useMutation({
    mutationFn: async (data: { name: string; branchId: string }) => {
      return schoolsService.create(data);
    },
    onSuccess: (newSchool) => {
      if (newSchool) {
        queryClient.invalidateQueries({ queryKey: ["schools"] });
        toast.success(t("register.schoolCreated"));
        form.setValue("schoolId", newSchool.id);
      }
    },
    onError: (error: any) => {
      toast.error(t("common.somethingWentWrong"), {
        description: error.message || t("common.tryAgain"),
      });
    },
  });

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
    },
  });

  // Auto-select branch when school is selected
  const schoolId = form.watch("schoolId");
  const branchId = form.watch("branchId");

  useEffect(() => {
    if (schoolId && schoolId !== "none" && schools) {
      const selectedSchool = schools.find((s) => s.id === schoolId);
      if (selectedSchool?.branchId) {
        form.setValue("branchId", selectedSchool.branchId);
      }
    }
  }, [schoolId, schools, form]);

  const onFormSubmit = (values: RegisterFormValues) => {
    startTransition(async () => {
      try {
        console.log("Attempting signup with:", {
          email: values.email,
          name: values.name,
          branchId: values.branchId,
          schoolId: values.schoolId,
          grade: values.grade,
        });

        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name,
              ...(values.branchId && values.branchId !== "none" && { branchId: values.branchId }),
              ...(values.schoolId && values.schoolId !== "none" && { schoolId: values.schoolId }),
              ...(values.grade && { grade: values.grade }),
            },
          },
        });

        console.log("Signup response:", { data, error });

        if (error) {
          console.error("Signup error details:", error);
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
        console.error("Unexpected signup error:", error);
        toast.error(t("common.somethingWentWrong"), {
          description: t("common.tryAgain"),
        });
      }
    });
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left: Hero panel */}
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <Link
          href="/"
          className="absolute left-6 top-6 flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors z-10"
        >
          <ArrowLeft className="size-4" />
          {t("common.backToHome")}
        </Link>
        <div className="absolute inset-0 flex flex-col items-start justify-start px-12 pt-32 text-left">
          <div className="max-w-lg">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
              {t("hero.title")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("hero.description")}
            </p>
          </div>
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
                      <FieldLabel htmlFor="confirmPassword">
                        {t("common.confirmPassword")}
                      </FieldLabel>
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
                      <Popover open={branchOpen} onOpenChange={setBranchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              (!field.value || field.value === "none") && "text-muted-foreground"
                            )}
                            disabled={isPending || branchesLoading}
                          >
                            {field.value && field.value !== "none" ? (
                              <span className="truncate">
                                {branches?.find((branch) => branch.id === field.value)?.name}
                              </span>
                            ) : (
                              t("register.selectBranch")
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput placeholder={t("register.selectBranch")} />
                            <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                              <CommandEmpty>{t("register.none")}</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="none"
                                  onSelect={() => {
                                    field.onChange(null);
                                    form.setValue("schoolId", null);
                                    setBranchOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      !field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {t("register.none")}
                                </CommandItem>
                                {branches?.map((branch) => (
                                  <CommandItem
                                    key={branch.id}
                                    value={branch.name}
                                    onSelect={() => {
                                      field.onChange(branch.id);
                                      form.setValue("schoolId", null);
                                      setBranchOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === branch.id ? "opacity-100" : "opacity-0"
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
                      <CreatableCombobox
                        items={
                          schools
                            ?.filter(
                              (school) =>
                                !branchId || branchId === "none" || school.branchId === branchId
                            )
                            .map((school) => ({
                              label: school.name,
                              value: school.id,
                            })) || []
                        }
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value || null)}
                        onCreateItem={async (schoolName) => {
                          if (branchId && branchId !== "none") {
                            createSchoolMutation.mutate({
                              name: schoolName,
                              branchId,
                            });
                          } else {
                            toast.error(t("register.selectBranch"));
                          }
                        }}
                        placeholder={t("register.selectSchool")}
                        emptyText={t("register.noSchoolsFound")}
                        createText={t("register.createSchool")}
                        disabled={isPending || schoolsLoading || createSchoolMutation.isPending}
                      />
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
                      {chunks}
                    </Link>
                  ),
                  privacy: (chunks) => (
                    <Link href="#" className="underline hover:text-muted-foreground">
                      {chunks}
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

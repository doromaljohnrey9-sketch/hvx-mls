"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/shared/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getSupabaseClient } from "@/lib/supabase/client";

import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";

import { AUTH_ROUTES } from "@/constants/routes.constant";
import { getBranchesQueryOptions } from "@/queries/branches.query";
import { getSchoolsQueryOptions } from "@/queries/schools.query";

export const PageClient = () => {
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
      branchId: "none",
      schoolId: "none",
    },
  });

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
            },
          },
        });

        if (error) {
          toast.error("Registration failed", {
            description: error.message,
          });
          return;
        }

        toast.success("Registration successful", {
          description: "Your account is pending approval by an administrator.",
        });

        form.reset();
        router.push(AUTH_ROUTES.LOGIN);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong", {
          description: "Please try again.",
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Register with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput
                      {...field}
                      id="password"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Controller
                name="branchId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="branchId">Branch (Optional)</FieldLabel>
                    <Select
                      {...field}
                      value={field.value || "none"}
                      onValueChange={(value) => {
                        field.onChange(value === "none" ? null : value);
                        // Reset school when branch changes
                        form.setValue("schoolId", "none");
                      }}
                      disabled={isPending || branchesLoading}
                    >
                      <SelectTrigger id="branchId" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select a branch or N/A" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">N/A</SelectItem>
                        {branches?.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Controller
                name="schoolId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="schoolId">School (Optional)</FieldLabel>
                    <Select
                      {...field}
                      value={field.value || "none"}
                      onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                      disabled={isPending || schoolsLoading}
                    >
                      <SelectTrigger id="schoolId" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select a school or N/A" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">N/A</SelectItem>
                        {schools?.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={isPending}>
                  Register
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href={AUTH_ROUTES.LOGIN}>Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By signing up, you agree to our <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
};

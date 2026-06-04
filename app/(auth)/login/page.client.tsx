"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PasswordInput } from "@/components/shared/password-input";

import { getSupabaseClient } from "@/lib/supabase/client";

import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";

import { AUTH_ROUTES, DEFAULT_AUTH_REDIRECT } from "@/constants/routes.constant";

export const PageClient = () => {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onFormSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      try {
        const { error } = await supabase.auth.signInWithPassword(values);

        if (error) {
          toast.error("Login failed", {
            description: error.message,
          });
          return;
        }

        toast.success("Welcome back!", {
          description: "You have been logged in successfully.",
        });
        router.replace(DEFAULT_AUTH_REDIRECT);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong", {
          description: "Please try again.",
        });
      }
    });
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left: Placeholder image panel */}
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <AspectRatio ratio={16 / 9} className="w-full max-w-md"></AspectRatio>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent" />
      </div>

      {/* Right: Form panel */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 lg:hidden">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Login with your email and password
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <Mail className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="email"
                        type="email"
                        placeholder="you@example.com"
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
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href={AUTH_ROUTES.FORGOT_PASSWORD}
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <PasswordInput
                      {...field}
                      id="password"
                      placeholder="Enter your password"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </div>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full" size="lg">
              {isPending ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href={AUTH_ROUTES.REGISTER}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </p>
              <p className="mt-3 text-xs text-muted-foreground/60">
                By logging in, you agree to our{" "}
                <Link href="#" className="underline hover:text-muted-foreground">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline hover:text-muted-foreground">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

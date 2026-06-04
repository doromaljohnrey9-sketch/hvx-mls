"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, GraduationCap, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { getSupabaseClient } from "@/lib/supabase/client";

import { type ForgotPasswordFormValues, forgotPasswordSchema } from "@/schemas/auth.schema";
import { AUTH_ROUTES } from "@/constants/routes.constant";

export const PageClient = () => {
  const supabase = getSupabaseClient();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onFormSubmit = (values: ForgotPasswordFormValues) => {
    startTransition(async () => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          toast.error("Reset password failed", {
            description: "Please check your email address and try again.",
          });
          return;
        }

        toast.success("Reset email sent", {
          description: "Please check your email for the password reset link.",
        });

        form.reset();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong", {
          description: "There was an issue sending the reset email. Please try again later.",
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
          Back to home
        </Link>
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
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Forgot Password
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your email to receive a password reset link
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
            </div>

            <Button type="submit" disabled={isPending} className="w-full" size="lg">
              {isPending ? "Sending reset link..." : "Reset Password"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link
                  href={AUTH_ROUTES.LOGIN}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Login
                </Link>
              </p>
              <p className="mt-3 text-xs text-muted-foreground/60">
                By clicking continue, you agree to our{" "}
                <Link href="#" className="underline hover:text-muted-foreground">
                  Terms of Service
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

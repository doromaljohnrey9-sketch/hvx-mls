"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PasswordInput } from "@/components/shared/password-input";

import { getSupabaseClient } from "@/lib/supabase/client";

import { resetPasswordSchema, type ResetPasswordFormValues } from "@/schemas/auth.schema";
import { AUTH_ROUTES } from "@/constants/routes.constant";

import { useTranslations } from "next-intl";

export const PageClient = () => {
  const t = useTranslations("Auth");
  const supabase = getSupabaseClient();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onFormSubmit = (values: ResetPasswordFormValues) => {
    startTransition(async () => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        });

        if (error) {
          toast.error(t("resetPassword.failed"), {
            description: t("resetPassword.failedDesc"),
          });
          return;
        }

        toast.success(t("resetPassword.success"), {
          description: t("resetPassword.successDesc"),
        });

        form.reset();
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
        <div className="absolute inset-0 flex items-center justify-center">
          <AspectRatio ratio={16 / 9} className="w-full max-w-md"></AspectRatio>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent" />
      </div>

      {/* Right: Form panel */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("resetPassword.title")}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{t("resetPassword.subtitle")}</p>
          </div>

          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="space-y-4">
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

            <Button type="submit" disabled={isPending} className="w-full" size="lg">
              {isPending ? t("common.resettingPassword") : t("resetPassword.submit")}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t("forgotPassword.rememberedPassword")}{" "}
                <Link
                  href={AUTH_ROUTES.LOGIN}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {t("common.login")}
                </Link>
              </p>
              <p className="mt-3 text-xs text-muted-foreground/60">
                {t.rich("common.agreementLogin", {
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

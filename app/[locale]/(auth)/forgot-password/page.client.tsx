"use client";

import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { getSupabaseClient } from "@/lib/supabase/client";

import { getAuthSchemas, type ForgotPasswordFormValues } from "@/schemas/auth.schema";
import { AUTH_ROUTES } from "@/constants/routes.constant";

import { useTranslations } from "next-intl";

export const PageClient = () => {
  const t = useTranslations("Auth");
  const { forgotPasswordSchema } = getAuthSchemas(t);
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
          toast.error(t("forgotPassword.failed"), {
            description: t("forgotPassword.failedDesc"),
          });
          return;
        }

        toast.success(t("forgotPassword.success"), {
          description: t("forgotPassword.successDesc"),
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
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("forgotPassword.title")}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{t("forgotPassword.subtitle")}</p>
          </div>

          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
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
            </div>

            <Button type="submit" disabled={isPending} className="w-full" size="lg">
              {isPending ? t("common.sendingReset") : t("forgotPassword.title")}
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

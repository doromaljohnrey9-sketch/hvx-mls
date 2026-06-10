import { useTranslations } from "next-intl";
import { z } from "zod";

export const getAuthSchemas = (t: ReturnType<typeof useTranslations<"Auth">>) => {
  const emailSchema = z.string().email(t("validation.invalidEmail"));
  const passwordSchema = z.string().min(6, t("validation.passwordMin"));
  const nameSchema = z.string().min(2, t("validation.nameMin"));
  const branchIdSchema = z
    .union([z.string().uuid(t("validation.invalidBranch")), z.literal("none"), z.null()])
    .optional();
  const schoolIdSchema = z
    .union([z.string().uuid(t("validation.invalidSchool")), z.literal("none"), z.null()])
    .optional();
  const gradeSchema = z
    .union([z.number().int().positive(t("validation.positiveGrade")), z.literal("none"), z.null()])
    .optional();

  const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const registerSchema = z
    .object({
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: passwordSchema,
      branchId: branchIdSchema,
      schoolId: schoolIdSchema,
      grade: gradeSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

  const forgotPasswordSchema = z.object({
    email: emailSchema,
  });

  const resetPasswordSchema = z
    .object({
      password: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

  return {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
  };
};

export type LoginFormValues = z.infer<ReturnType<typeof getAuthSchemas>["loginSchema"]>;
export type RegisterFormValues = z.infer<ReturnType<typeof getAuthSchemas>["registerSchema"]>;
export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof getAuthSchemas>["forgotPasswordSchema"]
>;
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof getAuthSchemas>["resetPasswordSchema"]
>;

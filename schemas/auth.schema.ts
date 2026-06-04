import { z } from "zod";

const emailSchema = z.email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters long");
const nameSchema = z.string().min(2, "Name must be at least 2 characters long");
const branchIdSchema = z
  .union([z.string().uuid("Please select a valid branch"), z.literal("none"), z.null()])
  .optional();
const schoolIdSchema = z
  .union([z.string().uuid("Please select a valid school"), z.literal("none"), z.null()])
  .optional();
const gradeSchema = z
  .union([
    z.number().int().positive("Grade must be a positive number"),
    z.literal("none"),
    z.null(),
  ])
  .optional();
const assignedTeacherSchema = z
  .string()
  .min(1, "Teacher name must be at least 1 character")
  .optional();

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    branchId: branchIdSchema,
    schoolId: schoolIdSchema,
    grade: gradeSchema,
    assignedTeacher: assignedTeacherSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

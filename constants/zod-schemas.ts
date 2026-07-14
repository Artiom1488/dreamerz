import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Onboarding Schemas
export const onboardingStep1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["MALE", "FEMALE"]),
});

export const onboardingStep2Schema = z.object({
  email: z.string().email("Enter a valid email address").optional(),
  phoneNumber: z.string().min(6, "Phone number is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
});

export const onboardingStep3Schema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(256, "Description must be 256 characters or less"),
});

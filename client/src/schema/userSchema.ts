import { z } from 'zod';

export const userSignupSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  year: z.string().min(1, "Year is required"),
  branch: z.string().min(1, "Branch is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignupInputState = z.infer<typeof userSignupSchema>;

export type LoginInputState = z.infer<typeof userLoginSchema>;
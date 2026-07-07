import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileUpdateSchema = z.object({
  title: z.string().trim().max(120).optional().nullable(),
  location: z.string().trim().max(120).optional().nullable(),
  bio: z.string().trim().max(1000).optional().nullable(),
  skills: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  websiteUrl: z.string().trim().url().max(300).optional().or(z.literal("")).nullable(),
  githubUrl: z.string().trim().url().max(300).optional().or(z.literal("")).nullable(),
  linkedinUrl: z.string().trim().url().max(300).optional().or(z.literal("")).nullable(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.email("Email tidak valid"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.email("Email tidak valid"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;

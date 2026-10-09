import { z } from "zod";

export const registerSchema = z.object({
  nombre: z.string().trim().min(1).max(100),
  apellido: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(50),
  contrasena: z.string().min(8).max(72),
  telefono: z.string().trim().min(1).max(30),
  rol: z.enum(["cliente", "profesional", "admin"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(),
  contrasena: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

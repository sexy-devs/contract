import { z } from "zod";

const nombreSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[A-Za-zÁÉÍÓÚÑÜáéíóúñü'\s-]+$/, "Solo se permiten letras y espacios");

const telefonoSchema = z
  .string()
  .trim()
  .min(6)
  .max(30)
  .regex(/^\+?[0-9\s-]{6,30}$/, "Formato de teléfono inválido");

const contrasenaRegistroSchema = z
  .string()
  .min(8)
  .max(72)
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Debe incluir al menos una letra y un número");

export const registerSchema = z.object({
  nombre: nombreSchema,
  apellido: nombreSchema,
  email: z.string().trim().toLowerCase().email().max(50),
  contrasena: contrasenaRegistroSchema,
  telefono: telefonoSchema,
  rol: z.enum(["cliente", "profesional"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  contrasena: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

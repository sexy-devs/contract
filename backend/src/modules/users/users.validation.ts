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

export const updateProfileSchema = z.object({
  nombre: nombreSchema.optional(),
  apellido: nombreSchema.optional(),
  telefono: telefonoSchema.optional(),
  fotoUrl: z.string().trim().url().max(500).optional(),
  idLocalidad: z.number().int().positive().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

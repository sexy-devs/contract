import { z } from "zod";

export const updateProfileSchema = z.object({
  nombre: z.string().trim().min(1).max(100).optional(),
  apellido: z.string().trim().min(1).max(100).optional(),
  telefono: z.string().trim().min(1).max(30).optional(),
  fotoUrl: z.string().trim().url().max(500).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

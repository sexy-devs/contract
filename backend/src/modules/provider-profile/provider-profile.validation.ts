import { z } from "zod";

export const updateProviderProfileSchema = z.object({
  descripcion: z.string().trim().max(500).optional(),
  aniosExperiencia: z.number().int().min(0).max(100).optional(),
  aceptaRadioKm: z.number().int().min(0).max(200).optional(),
  disponibilidad: z.string().trim().max(200).optional(),
});

export type UpdateProviderProfileInput = z.infer<typeof updateProviderProfileSchema>;

export const replaceServicesSchema = z.object({
  servicios: z.array(
    z.object({
      idServ: z.number().int().positive(),
      monto: z.number().int().min(0),
    }),
  ),
});

export type ReplaceServicesInput = z.infer<typeof replaceServicesSchema>;

export const createMatriculaSchema = z.object({
  fotoUrl: z.string().trim().url().max(500),
  fechaExpiracion: z.string().trim().date().optional(),
});

export type CreateMatriculaInput = z.infer<typeof createMatriculaSchema>;

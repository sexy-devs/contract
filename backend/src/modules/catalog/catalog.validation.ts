import { z } from "zod";

export const searchProvidersSchema = z.object({
  servicio: z.string().trim().max(100).optional(),
  zona: z.string().trim().max(100).optional(),
  soloDisponibles: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  ordenarPor: z.enum(["calificacion", "precio", "distancia"]).optional().default("calificacion"),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export type SearchProvidersInput = z.infer<typeof searchProvidersSchema>;

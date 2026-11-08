import { z } from "zod";

import { rolUsuarioValues } from "../../database/schema";

export const adminUserIdSchema = z.coerce.number().int().positive();

const nombreSchema = z
  .string()
  .trim()
  .min(1, "Campo obligatorio.")
  .max(100, "No puede superar los 100 caracteres.")
  .regex(/^[A-Za-zÁÉÍÓÚÑÜáéíóúñü'\s-]+$/, "Solo se permiten letras y espacios.");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Campo obligatorio.")
  .max(50, "No puede superar los 50 caracteres.")
  .email("Formato de email inválido.");

const telefonoSchema = z
  .string()
  .trim()
  .min(1, "Campo obligatorio.")
  .max(30, "No puede superar los 30 caracteres.")
  .regex(/^\+?[0-9\s-]{6,30}$/, "Solo números, espacios, + y -.");

export const updateAdminUserSchema = z.object({
  nombre: nombreSchema,
  apellido: nombreSchema,
  email: emailSchema,
  telefono: telefonoSchema,
  rol: z.enum(rolUsuarioValues, { message: "Seleccioná un rol válido." }),
});

export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;

export const listAdminUsersQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  rol: z.enum(rolUsuarioValues).optional(),
});

export type ListAdminUsersQuery = z.infer<typeof listAdminUsersQuerySchema>;

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

const baseRegisterFields = {
  nombre: nombreSchema,
  apellido: nombreSchema,
  email: z.string().trim().toLowerCase().email().max(50),
  contrasena: contrasenaRegistroSchema,
  telefono: telefonoSchema,
};

const clienteRegisterSchema = z.object({
  ...baseRegisterFields,
  rol: z.literal("cliente"),
  idLocalidad: z.number().int().positive().optional(),
});

const profesionalRegisterSchema = z.object({
  ...baseRegisterFields,
  rol: z.literal("profesional"),
  descripcion: z.string().trim().min(1, "Este campo es obligatorio").max(500),
  aniosExperiencia: z.number().int().min(0).max(100),
  idLocalidad: z.number().int().positive(),
  aceptaRadioKm: z.number().int().min(0).max(200),
  disponibilidad: z.string().trim().min(1, "Este campo es obligatorio").max(200),
  servicios: z
    .array(z.object({ idServ: z.number().int().positive(), monto: z.number().int().min(1) }))
    .min(1, "Debe ofrecer al menos un servicio"),
});

export const registerSchema = z.discriminatedUnion("rol", [clienteRegisterSchema, profesionalRegisterSchema]);

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  contrasena: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

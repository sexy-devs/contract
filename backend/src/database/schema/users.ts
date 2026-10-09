import { boolean, doublePrecision, index, integer, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { codigosXLocalidad } from "./location";

export const rolUsuarioValues = ["cliente", "profesional", "admin"] as const;
export const estadoRegistroValues = ["pendiente", "activo", "suspendido"] as const;

export const rolUsuarioEnum = pgEnum("rol_usuario", rolUsuarioValues);
export const estadoRegistroEnum = pgEnum("estado_registro", estadoRegistroValues);

export const usuarios = pgTable(
  "usuarios",
  {
    id: serial("id").primaryKey(),
    nombre: varchar("nombre", { length: 100 }).notNull(),
    apellido: varchar("apellido", { length: 100 }).notNull(),
    email: varchar("email", { length: 50 }).notNull().unique(),
    emailVerificado: boolean("email_verificado").notNull().default(false),
    contrasena: varchar("contrasena", { length: 255 }).notNull(),
    telefono: varchar("telefono", { length: 30 }).notNull(),
    fotoUrl: varchar("foto_url", { length: 500 }),
    idCodigoLocalidad: integer("id_codigo_localidad").references(() => codigosXLocalidad.id),
    latitud: doublePrecision("latitud"),
    longitud: doublePrecision("longitud"),
    fechaCreado: timestamp("fecha_creado").notNull().defaultNow(),
    fechaUltimoLogeo: timestamp("fecha_ultimo_logeo"),
    rol: rolUsuarioEnum("rol").notNull(),
    activo: boolean("activo").notNull().default(true),
    estadoRegistro: estadoRegistroEnum("estado_registro").notNull().default("pendiente"),
  },
  (table) => [index("usuarios_rol_activo_idx").on(table.rol, table.activo)],
);

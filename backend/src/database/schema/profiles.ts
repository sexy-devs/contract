import { boolean, doublePrecision, index, integer, pgTable, serial, smallint, varchar } from "drizzle-orm/pg-core";

import { usuarios } from "./users";

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  idUsuario: integer("id_usuario").notNull().unique().references(() => usuarios.id, { onDelete: "cascade" }),
});

export const profesionales = pgTable(
  "profesionales",
  {
    id: serial("id").primaryKey(),
    idUsuario: integer("id_usuario").notNull().unique().references(() => usuarios.id, { onDelete: "cascade" }),
    descripcion: varchar("descripcion", { length: 500 }),
    aniosExperiencia: smallint("anios_experiencia").notNull().default(0),
    aceptaRadioKm: smallint("acepta_radio_km").notNull().default(0),
    verificado: boolean("verificado").notNull().default(false),
    disponibilidad: varchar("disponibilidad", { length: 200 }),
    trabajosPendientes: smallint("trabajos_pendientes").notNull().default(0),
    trabajosFinalizados: smallint("trabajos_finalizados").notNull().default(0),
    calificacionGlobal: doublePrecision("calificacion_global").notNull().default(0),
    cantidadCalificaciones: integer("cantidad_calificaciones").notNull().default(0),
  },
  (table) => [index("profesionales_verificado_calificacion_idx").on(table.verificado, table.calificacionGlobal)],
);

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  idUsuario: integer("id_usuario").notNull().unique().references(() => usuarios.id, { onDelete: "cascade" }),
  resetAcceso: smallint("reset_acceso").notNull().default(0),
});

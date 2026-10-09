import { date, index, integer, pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { profesionales } from "./profiles";

export const estadoMatriculaValues = ["pendiente", "aprobada", "rechazada"] as const;
export const estadoMatriculaEnum = pgEnum("estado_matricula", estadoMatriculaValues);

export const matriculas = pgTable("matriculas", {
  id: serial("id").primaryKey(),
  estado: estadoMatriculaEnum("estado").notNull().default("pendiente"),
  fechaExpiracion: date("fecha_expiracion"),
  fotoUrl: varchar("foto_url", { length: 500 }),
});

export const matriculasXProfesional = pgTable(
  "matriculas_x_profesional",
  {
    id: serial("id").primaryKey(),
    idProf: integer("id_prof").notNull().references(() => profesionales.id, { onDelete: "cascade" }),
    idMatricula: integer("id_matricula").notNull().references(() => matriculas.id, { onDelete: "cascade" }),
  },
  (table) => [index("matriculas_x_profesional_prof_idx").on(table.idProf)],
);

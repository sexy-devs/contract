import { index, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { profesionales } from "./profiles";

export const servicios = pgTable("servicios", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
});

export const serviciosXProfesional = pgTable(
  "servicios_x_profesional",
  {
    id: serial("id").primaryKey(),
    monto: integer("monto").notNull(),
    idProf: integer("id_prof").notNull().references(() => profesionales.id, { onDelete: "cascade" }),
    idServ: integer("id_serv").notNull().references(() => servicios.id, { onDelete: "restrict" }),
  },
  (table) => [index("servicios_x_profesional_prof_idx").on(table.idProf)],
);

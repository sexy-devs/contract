import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const provincias = pgTable("provincias", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
});

export const localidades = pgTable("localidades", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  idProvincia: integer("id_provincia").notNull().references(() => provincias.id),
});

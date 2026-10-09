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

export const codigosPostales = pgTable("codigos_postales", {
  codigo: integer("codigo").primaryKey(),
});

export const codigosXLocalidad = pgTable("codigos_x_localidad", {
  id: serial("id").primaryKey(),
  idCodigoPostal: integer("id_codigo_postal").notNull().references(() => codigosPostales.codigo),
  idLocalidad: integer("id_localidad").notNull().references(() => localidades.id),
});

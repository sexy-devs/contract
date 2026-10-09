import { index, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { clientes, profesionales } from "./profiles";
import { usuarios } from "./users";

export const chats = pgTable(
  "chat",
  {
    id: serial("id").primaryKey(),
    idCliente: integer("id_cliente").notNull().references(() => clientes.id, { onDelete: "cascade" }),
    idProf: integer("id_prof").notNull().references(() => profesionales.id, { onDelete: "cascade" }),
  },
  (table) => [index("chat_cliente_prof_idx").on(table.idCliente, table.idProf)],
);

export const mensajes = pgTable(
  "mensajes",
  {
    id: serial("id").primaryKey(),
    mensaje: varchar("mensaje", { length: 500 }).notNull(),
    fechaCreado: timestamp("fecha_creado").notNull().defaultNow(),
    idChat: integer("id_chat").notNull().references(() => chats.id, { onDelete: "cascade" }),
    idRemitente: integer("id_remitente").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  },
  (table) => [index("mensajes_chat_fecha_idx").on(table.idChat, table.fechaCreado)],
);

import { date, index, integer, pgEnum, pgTable, serial, smallint, time, timestamp, varchar } from "drizzle-orm/pg-core";

import { clientes, profesionales } from "./profiles";

export const estadoPedidoValues = ["solicitado", "presupuestado", "aceptado", "en_curso", "finalizado", "cancelado"] as const;
export const estadoPedidoEnum = pgEnum("estado_pedido", estadoPedidoValues);

export const pedidos = pgTable(
  "pedidos",
  {
    id: serial("id").primaryKey(),
    idCliente: integer("id_cliente").notNull().references(() => clientes.id, { onDelete: "cascade" }),
    idProf: integer("id_prof").notNull().references(() => profesionales.id, { onDelete: "cascade" }),
    fecha: date("fecha").notNull(),
    hora: time("hora").notNull(),
    estado: estadoPedidoEnum("estado").notNull().default("solicitado"),
    fechaCreado: timestamp("fecha_creado").notNull().defaultNow(),
  },
  (table) => [
    index("pedidos_prof_fecha_hora_idx").on(table.idProf, table.fecha, table.hora),
    index("pedidos_cliente_idx").on(table.idCliente),
  ],
);

export const calificaciones = pgTable("calificaciones", {
  id: serial("id").primaryKey(),
  idPedido: integer("id_pedido").notNull().unique().references(() => pedidos.id, { onDelete: "cascade" }),
  calificacion: smallint("calificacion").notNull(),
  comentario: varchar("comentario", { length: 300 }),
  fechaCreado: timestamp("fecha_creado").notNull().defaultNow(),
});

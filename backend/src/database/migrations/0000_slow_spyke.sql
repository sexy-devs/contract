CREATE TYPE "public"."estado_registro" AS ENUM('pendiente', 'activo', 'suspendido');--> statement-breakpoint
CREATE TYPE "public"."rol_usuario" AS ENUM('cliente', 'profesional', 'admin');--> statement-breakpoint
CREATE TYPE "public"."estado_matricula" AS ENUM('pendiente', 'aprobada', 'rechazada');--> statement-breakpoint
CREATE TYPE "public"."estado_pedido" AS ENUM('solicitado', 'presupuestado', 'aceptado', 'en_curso', 'finalizado', 'cancelado');--> statement-breakpoint
CREATE TABLE "codigos_postales" (
	"codigo" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "codigos_x_localidad" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_codigo_postal" integer NOT NULL,
	"id_localidad" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "localidades" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"id_provincia" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provincias" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"apellido" varchar(100) NOT NULL,
	"email" varchar(50) NOT NULL,
	"email_verificado" boolean DEFAULT false NOT NULL,
	"contrasena" varchar(255) NOT NULL,
	"telefono" varchar(30) NOT NULL,
	"foto_url" varchar(500),
	"id_codigo_localidad" integer,
	"fecha_creado" timestamp DEFAULT now() NOT NULL,
	"fecha_ultimo_logeo" timestamp,
	"rol" "rol_usuario" NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"estado_registro" "estado_registro" DEFAULT 'pendiente' NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer NOT NULL,
	"reset_acceso" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "admins_id_usuario_unique" UNIQUE("id_usuario")
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer NOT NULL,
	CONSTRAINT "clientes_id_usuario_unique" UNIQUE("id_usuario")
);
--> statement-breakpoint
CREATE TABLE "profesionales" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer NOT NULL,
	"descripcion" varchar(500),
	"anios_experiencia" smallint DEFAULT 0 NOT NULL,
	"acepta_radio_km" smallint DEFAULT 0 NOT NULL,
	"verificado" boolean DEFAULT false NOT NULL,
	"disponibilidad" varchar(200),
	"trabajos_pendientes" smallint DEFAULT 0 NOT NULL,
	"trabajos_finalizados" smallint DEFAULT 0 NOT NULL,
	"calificacion_global" double precision DEFAULT 0 NOT NULL,
	"cantidad_calificaciones" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "profesionales_id_usuario_unique" UNIQUE("id_usuario")
);
--> statement-breakpoint
CREATE TABLE "servicios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servicios_x_profesional" (
	"id" serial PRIMARY KEY NOT NULL,
	"monto" integer NOT NULL,
	"id_prof" integer NOT NULL,
	"id_serv" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matriculas" (
	"id" serial PRIMARY KEY NOT NULL,
	"estado" "estado_matricula" DEFAULT 'pendiente' NOT NULL,
	"fecha_expiracion" date,
	"foto_url" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "matriculas_x_profesional" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_prof" integer NOT NULL,
	"id_matricula" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calificaciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_pedido" integer NOT NULL,
	"calificacion" smallint NOT NULL,
	"comentario" varchar(300),
	"fecha_creado" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "calificaciones_id_pedido_unique" UNIQUE("id_pedido")
);
--> statement-breakpoint
CREATE TABLE "pedidos" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_cliente" integer NOT NULL,
	"id_prof" integer NOT NULL,
	"fecha" date NOT NULL,
	"hora" time NOT NULL,
	"estado" "estado_pedido" DEFAULT 'solicitado' NOT NULL,
	"fecha_creado" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_cliente" integer NOT NULL,
	"id_prof" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mensajes" (
	"id" serial PRIMARY KEY NOT NULL,
	"mensaje" varchar(500) NOT NULL,
	"fecha_creado" timestamp DEFAULT now() NOT NULL,
	"id_chat" integer NOT NULL,
	"id_remitente" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "codigos_x_localidad" ADD CONSTRAINT "codigos_x_localidad_id_codigo_postal_codigos_postales_codigo_fk" FOREIGN KEY ("id_codigo_postal") REFERENCES "public"."codigos_postales"("codigo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "codigos_x_localidad" ADD CONSTRAINT "codigos_x_localidad_id_localidad_localidades_id_fk" FOREIGN KEY ("id_localidad") REFERENCES "public"."localidades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "localidades" ADD CONSTRAINT "localidades_id_provincia_provincias_id_fk" FOREIGN KEY ("id_provincia") REFERENCES "public"."provincias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_codigo_localidad_codigos_x_localidad_id_fk" FOREIGN KEY ("id_codigo_localidad") REFERENCES "public"."codigos_x_localidad"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profesionales" ADD CONSTRAINT "profesionales_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicios_x_profesional" ADD CONSTRAINT "servicios_x_profesional_id_prof_profesionales_id_fk" FOREIGN KEY ("id_prof") REFERENCES "public"."profesionales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicios_x_profesional" ADD CONSTRAINT "servicios_x_profesional_id_serv_servicios_id_fk" FOREIGN KEY ("id_serv") REFERENCES "public"."servicios"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matriculas_x_profesional" ADD CONSTRAINT "matriculas_x_profesional_id_prof_profesionales_id_fk" FOREIGN KEY ("id_prof") REFERENCES "public"."profesionales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matriculas_x_profesional" ADD CONSTRAINT "matriculas_x_profesional_id_matricula_matriculas_id_fk" FOREIGN KEY ("id_matricula") REFERENCES "public"."matriculas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_id_pedido_pedidos_id_fk" FOREIGN KEY ("id_pedido") REFERENCES "public"."pedidos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_cliente_clientes_id_fk" FOREIGN KEY ("id_cliente") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_prof_profesionales_id_fk" FOREIGN KEY ("id_prof") REFERENCES "public"."profesionales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_id_cliente_clientes_id_fk" FOREIGN KEY ("id_cliente") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_id_prof_profesionales_id_fk" FOREIGN KEY ("id_prof") REFERENCES "public"."profesionales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_id_chat_chat_id_fk" FOREIGN KEY ("id_chat") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_id_remitente_usuarios_id_fk" FOREIGN KEY ("id_remitente") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "usuarios_rol_activo_idx" ON "usuarios" USING btree ("rol","activo");--> statement-breakpoint
CREATE INDEX "profesionales_verificado_calificacion_idx" ON "profesionales" USING btree ("verificado","calificacion_global");--> statement-breakpoint
CREATE INDEX "servicios_x_profesional_prof_idx" ON "servicios_x_profesional" USING btree ("id_prof");--> statement-breakpoint
CREATE INDEX "matriculas_x_profesional_prof_idx" ON "matriculas_x_profesional" USING btree ("id_prof");--> statement-breakpoint
CREATE INDEX "pedidos_prof_fecha_hora_idx" ON "pedidos" USING btree ("id_prof","fecha","hora");--> statement-breakpoint
CREATE INDEX "pedidos_cliente_idx" ON "pedidos" USING btree ("id_cliente");--> statement-breakpoint
CREATE INDEX "chat_cliente_prof_idx" ON "chat" USING btree ("id_cliente","id_prof");--> statement-breakpoint
CREATE INDEX "mensajes_chat_fecha_idx" ON "mensajes" USING btree ("id_chat","fecha_creado");
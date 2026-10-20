ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "direccion";--> statement-breakpoint
ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "ciudad";--> statement-breakpoint
ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "codigo_postal";--> statement-breakpoint
ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "id_codigo_localidad";--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "id_localidad" integer REFERENCES "localidades"("id");--> statement-breakpoint
DROP TABLE IF EXISTS "codigos_x_localidad";--> statement-breakpoint
DROP TABLE IF EXISTS "codigos_postales";

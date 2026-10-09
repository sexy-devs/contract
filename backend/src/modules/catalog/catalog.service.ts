import { and, countDistinct, eq, ilike, sql } from "drizzle-orm";

import { db } from "../../database/client";
import {
  codigosXLocalidad,
  localidades,
  matriculas,
  matriculasXProfesional,
  profesionales,
  servicios,
  serviciosXProfesional,
  usuarios,
} from "../../database/schema";
import { NotFoundError } from "../../shared/errors/AppError";
import type { SearchProvidersInput } from "./catalog.validation";

function buildFilters(input: Pick<SearchProvidersInput, "servicio" | "zona" | "soloDisponibles">) {
  const conditions = [];

  if (input.servicio) {
    conditions.push(ilike(servicios.nombre, `%${input.servicio}%`));
  }

  if (input.zona) {
    conditions.push(ilike(localidades.nombre, `%${input.zona}%`));
  }

  if (input.soloDisponibles) {
    conditions.push(sql`${profesionales.disponibilidad} is not null and ${profesionales.disponibilidad} <> ''`);
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

function distanciaKmExpr(lat: number, lng: number) {
  return sql<number | null>`
    case when ${usuarios.latitud} is null or ${usuarios.longitud} is null then null else
      6371 * acos(
        least(1, greatest(-1,
          cos(radians(${lat})) * cos(radians(${usuarios.latitud})) * cos(radians(${usuarios.longitud}) - radians(${lng}))
          + sin(radians(${lat})) * sin(radians(${usuarios.latitud}))
        ))
      )
    end
  `;
}

export async function searchProviders(input: SearchProvidersInput) {
  const offset = (input.page - 1) * input.limit;
  const whereClause = buildFilters(input);
  const hasOrigin = input.lat !== undefined && input.lng !== undefined;

  const baseQuery = db
    .select({
      id: profesionales.id,
      nombre: usuarios.nombre,
      apellido: usuarios.apellido,
      descripcion: profesionales.descripcion,
      calificacionGlobal: profesionales.calificacionGlobal,
      cantidadCalificaciones: profesionales.cantidadCalificaciones,
      verificado: profesionales.verificado,
      disponibilidad: profesionales.disponibilidad,
      zona: localidades.nombre,
      precioDesde: sql<number | null>`min(${serviciosXProfesional.monto})`.as("precio_desde"),
      distanciaKm: hasOrigin
        ? distanciaKmExpr(input.lat as number, input.lng as number).as("distancia_km")
        : sql<number | null>`null`.as("distancia_km"),
    })
    .from(profesionales)
    .innerJoin(usuarios, eq(usuarios.id, profesionales.idUsuario))
    .leftJoin(codigosXLocalidad, eq(codigosXLocalidad.id, usuarios.idCodigoLocalidad))
    .leftJoin(localidades, eq(localidades.id, codigosXLocalidad.idLocalidad))
    .leftJoin(serviciosXProfesional, eq(serviciosXProfesional.idProf, profesionales.id))
    .leftJoin(servicios, eq(servicios.id, serviciosXProfesional.idServ))
    .where(whereClause)
    .groupBy(profesionales.id, usuarios.id, localidades.id);

  const orderedQuery =
    input.ordenarPor === "precio"
      ? baseQuery.orderBy(sql`min(${serviciosXProfesional.monto}) asc nulls last`)
      : input.ordenarPor === "distancia" && hasOrigin
        ? baseQuery.orderBy(sql`${distanciaKmExpr(input.lat as number, input.lng as number)} asc nulls last`)
        : baseQuery.orderBy(sql`${profesionales.calificacionGlobal} desc`);

  const [rows, [{ total } = { total: 0 }]] = await Promise.all([
    orderedQuery.limit(input.limit).offset(offset),
    db
      .select({ total: countDistinct(profesionales.id) })
      .from(profesionales)
      .innerJoin(usuarios, eq(usuarios.id, profesionales.idUsuario))
      .leftJoin(codigosXLocalidad, eq(codigosXLocalidad.id, usuarios.idCodigoLocalidad))
      .leftJoin(localidades, eq(localidades.id, codigosXLocalidad.idLocalidad))
      .leftJoin(serviciosXProfesional, eq(serviciosXProfesional.idProf, profesionales.id))
      .leftJoin(servicios, eq(servicios.id, serviciosXProfesional.idServ))
      .where(whereClause),
  ]);

  return {
    data: rows,
    pagination: { page: input.page, limit: input.limit, total },
  };
}

export async function getProviderPublicProfile(providerId: number) {
  const profesional = await db.query.profesionales.findFirst({ where: eq(profesionales.id, providerId) });

  if (!profesional) {
    throw new NotFoundError("Prestador no encontrado");
  }

  const [usuario, serviciosOfrecidos, matriculaVigente] = await Promise.all([
    db.query.usuarios.findFirst({ where: eq(usuarios.id, profesional.idUsuario) }),
    db
      .select({ id: servicios.id, nombre: servicios.nombre, monto: serviciosXProfesional.monto })
      .from(serviciosXProfesional)
      .innerJoin(servicios, eq(servicios.id, serviciosXProfesional.idServ))
      .where(eq(serviciosXProfesional.idProf, profesional.id)),
    db
      .select({ estado: matriculas.estado, fechaExpiracion: matriculas.fechaExpiracion })
      .from(matriculasXProfesional)
      .innerJoin(matriculas, eq(matriculas.id, matriculasXProfesional.idMatricula))
      .where(eq(matriculasXProfesional.idProf, profesional.id)),
  ]);

  return {
    id: profesional.id,
    nombre: usuario?.nombre,
    apellido: usuario?.apellido,
    descripcion: profesional.descripcion,
    aniosExperiencia: profesional.aniosExperiencia,
    verificado: profesional.verificado,
    disponibilidad: profesional.disponibilidad,
    trabajosFinalizados: profesional.trabajosFinalizados,
    calificacionGlobal: profesional.calificacionGlobal,
    cantidadCalificaciones: profesional.cantidadCalificaciones,
    servicios: serviciosOfrecidos,
    matriculas: matriculaVigente,
  };
}

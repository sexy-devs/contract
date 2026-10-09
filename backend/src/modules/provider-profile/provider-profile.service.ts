import { eq } from "drizzle-orm";

import { db } from "../../database/client";
import { matriculas, matriculasXProfesional, profesionales, serviciosXProfesional } from "../../database/schema";
import { NotFoundError } from "../../shared/errors/AppError";
import type { CreateMatriculaInput, ReplaceServicesInput, UpdateProviderProfileInput } from "./provider-profile.validation";

async function findProfesionalByUserId(userId: number) {
  const profesional = await db.query.profesionales.findFirst({ where: eq(profesionales.idUsuario, userId) });

  if (!profesional) {
    throw new NotFoundError("Perfil profesional no encontrado");
  }

  return profesional;
}

export async function getProviderProfile(userId: number) {
  return findProfesionalByUserId(userId);
}

export async function updateProviderProfile(userId: number, input: UpdateProviderProfileInput) {
  const profesional = await findProfesionalByUserId(userId);

  const [updated] = await db
    .update(profesionales)
    .set(input)
    .where(eq(profesionales.id, profesional.id))
    .returning();

  return updated;
}

export async function replaceServices(userId: number, input: ReplaceServicesInput) {
  const profesional = await findProfesionalByUserId(userId);

  return db.transaction(async (tx) => {
    await tx.delete(serviciosXProfesional).where(eq(serviciosXProfesional.idProf, profesional.id));

    if (input.servicios.length === 0) {
      return [];
    }

    return tx
      .insert(serviciosXProfesional)
      .values(input.servicios.map((servicio) => ({ idProf: profesional.id, idServ: servicio.idServ, monto: servicio.monto })))
      .returning();
  });
}

export async function createMatricula(userId: number, input: CreateMatriculaInput) {
  const profesional = await findProfesionalByUserId(userId);

  return db.transaction(async (tx) => {
    const [matricula] = await tx
      .insert(matriculas)
      .values({ fotoUrl: input.fotoUrl, fechaExpiracion: input.fechaExpiracion, estado: "pendiente" })
      .returning();

    if (!matricula) {
      throw new Error("No se pudo crear la matrícula");
    }

    await tx.insert(matriculasXProfesional).values({ idProf: profesional.id, idMatricula: matricula.id });

    return matricula;
  });
}

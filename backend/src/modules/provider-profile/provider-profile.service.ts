import { desc, eq } from "drizzle-orm";

import { db } from "../../database/client";
import { matriculas, matriculasXProfesional, profesionales, servicios, serviciosXProfesional } from "../../database/schema";
import { NotFoundError, ValidationError } from "../../shared/errors/AppError";
import { uploadBufferToCloudinary } from "../../shared/upload/cloudinaryUpload";
import type {
  CreateMatriculaInput,
  ReplaceServicesInput,
  UpdateMatriculaInput,
  UpdateProviderProfileInput,
} from "./provider-profile.validation";

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

export async function getMyServices(userId: number) {
  const profesional = await findProfesionalByUserId(userId);

  return db
    .select({ id: serviciosXProfesional.id, idServ: servicios.id, nombre: servicios.nombre, monto: serviciosXProfesional.monto })
    .from(serviciosXProfesional)
    .innerJoin(servicios, eq(servicios.id, serviciosXProfesional.idServ))
    .where(eq(serviciosXProfesional.idProf, profesional.id));
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

export async function createMatricula(userId: number, input: CreateMatriculaInput, file: Express.Multer.File | undefined) {
  if (!file) {
    throw new ValidationError("Debe enviar un archivo de matrícula o certificación");
  }

  const profesional = await findProfesionalByUserId(userId);
  const fotoUrl = await uploadBufferToCloudinary(file.buffer, `contract/matriculas/${profesional.id}`, "auto");

  return db.transaction(async (tx) => {
    const [matricula] = await tx
      .insert(matriculas)
      .values({ fotoUrl, fechaExpiracion: input.fechaExpiracion, estado: "pendiente" })
      .returning();

    if (!matricula) {
      throw new Error("No se pudo crear la matrícula");
    }

    await tx.insert(matriculasXProfesional).values({ idProf: profesional.id, idMatricula: matricula.id });

    return matricula;
  });
}

export async function getMyMatricula(userId: number) {
  const profesional = await findProfesionalByUserId(userId);

  const [vinculo] = await db
    .select({ matricula: matriculas })
    .from(matriculasXProfesional)
    .innerJoin(matriculas, eq(matriculas.id, matriculasXProfesional.idMatricula))
    .where(eq(matriculasXProfesional.idProf, profesional.id))
    .orderBy(desc(matriculasXProfesional.id))
    .limit(1);

  return vinculo?.matricula ?? null;
}

export async function updateMyMatricula(userId: number, input: UpdateMatriculaInput) {
  const profesional = await findProfesionalByUserId(userId);

  const [vinculo] = await db
    .select({ idMatricula: matriculasXProfesional.idMatricula })
    .from(matriculasXProfesional)
    .where(eq(matriculasXProfesional.idProf, profesional.id))
    .orderBy(desc(matriculasXProfesional.id))
    .limit(1);

  if (!vinculo) {
    throw new NotFoundError("No tenés una matrícula cargada");
  }

  const [updated] = await db
    .update(matriculas)
    .set({ fechaExpiracion: input.fechaExpiracion })
    .where(eq(matriculas.id, vinculo.idMatricula))
    .returning();

  return updated;
}

export async function deleteMyMatricula(userId: number) {
  const profesional = await findProfesionalByUserId(userId);

  const [vinculo] = await db
    .select({ idMatricula: matriculasXProfesional.idMatricula })
    .from(matriculasXProfesional)
    .where(eq(matriculasXProfesional.idProf, profesional.id))
    .orderBy(desc(matriculasXProfesional.id))
    .limit(1);

  if (!vinculo) {
    throw new NotFoundError("No tenés una matrícula cargada");
  }

  await db.delete(matriculas).where(eq(matriculas.id, vinculo.idMatricula));
}

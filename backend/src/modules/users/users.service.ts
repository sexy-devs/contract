import { eq } from "drizzle-orm";

import { db } from "../../database/client";
import { localidades, usuarios } from "../../database/schema";
import { NotFoundError, ValidationError } from "../../shared/errors/AppError";
import { uploadBufferToCloudinary } from "../../shared/upload/cloudinaryUpload";
import type { UpdateProfileInput } from "./users.validation";

export async function getProfile(userId: number) {
  const usuario = await db.query.usuarios.findFirst({ where: eq(usuarios.id, userId) });

  if (!usuario) {
    throw new NotFoundError("Usuario no encontrado");
  }

  return toPublicUser(usuario);
}

export async function updateProfile(userId: number, input: UpdateProfileInput) {
  if (input.idLocalidad !== undefined) {
    const localidad = await db.query.localidades.findFirst({ where: eq(localidades.id, input.idLocalidad) });

    if (!localidad) {
      throw new ValidationError("La localidad seleccionada no existe");
    }
  }

  const [updated] = await db.update(usuarios).set(input).where(eq(usuarios.id, userId)).returning();

  if (!updated) {
    throw new NotFoundError("Usuario no encontrado");
  }

  return toPublicUser(updated);
}

export async function updateProfilePhoto(userId: number, file: Express.Multer.File | undefined) {
  if (!file) {
    throw new ValidationError("Debe enviar un archivo de imagen");
  }

  const fotoUrl = await uploadBufferToCloudinary(file.buffer, `contract/usuarios/${userId}`);

  const [updated] = await db.update(usuarios).set({ fotoUrl }).where(eq(usuarios.id, userId)).returning();

  if (!updated) {
    throw new NotFoundError("Usuario no encontrado");
  }

  return toPublicUser(updated);
}

function toPublicUser(usuario: typeof usuarios.$inferSelect) {
  const { contrasena: _contrasena, ...publicUser } = usuario;
  return publicUser;
}

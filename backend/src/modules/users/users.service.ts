import { eq } from "drizzle-orm";

import { db } from "../../database/client";
import { usuarios } from "../../database/schema";
import { NotFoundError } from "../../shared/errors/AppError";
import type { UpdateProfileInput } from "./users.validation";

export async function getProfile(userId: number) {
  const usuario = await db.query.usuarios.findFirst({ where: eq(usuarios.id, userId) });

  if (!usuario) {
    throw new NotFoundError("Usuario no encontrado");
  }

  return toPublicUser(usuario);
}

export async function updateProfile(userId: number, input: UpdateProfileInput) {
  const [updated] = await db.update(usuarios).set(input).where(eq(usuarios.id, userId)).returning();

  if (!updated) {
    throw new NotFoundError("Usuario no encontrado");
  }

  return toPublicUser(updated);
}

function toPublicUser(usuario: typeof usuarios.$inferSelect) {
  const { contrasena: _contrasena, ...publicUser } = usuario;
  return publicUser;
}

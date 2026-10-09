import { eq } from "drizzle-orm";

import { db } from "../../database/client";
import { clientes, profesionales, usuarios } from "../../database/schema";
import { ConflictError, UnauthorizedError } from "../../shared/errors/AppError";
import { comparePassword, hashPassword } from "../../shared/utils/password";
import { signToken } from "../../shared/utils/jwt";
import type { LoginInput, RegisterInput } from "./auth.validation";

export async function register(input: RegisterInput) {
  const existing = await db.query.usuarios.findFirst({ where: eq(usuarios.email, input.email) });

  if (existing) {
    throw new ConflictError("El email ya se encuentra registrado");
  }

  const contrasenaHash = await hashPassword(input.contrasena);

  const usuario = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(usuarios)
      .values({
        nombre: input.nombre,
        apellido: input.apellido,
        email: input.email,
        contrasena: contrasenaHash,
        telefono: input.telefono,
        rol: input.rol,
        estadoRegistro: "activo",
      })
      .returning();

    if (!created) {
      throw new Error("No se pudo crear el usuario");
    }

    if (input.rol === "cliente") {
      await tx.insert(clientes).values({ idUsuario: created.id });
    } else if (input.rol === "profesional") {
      await tx.insert(profesionales).values({ idUsuario: created.id });
    }

    return created;
  });

  const token = signToken({ sub: usuario.id, rol: usuario.rol });

  return { token, usuario: toPublicUser(usuario) };
}

export async function login(input: LoginInput) {
  const usuario = await db.query.usuarios.findFirst({ where: eq(usuarios.email, input.email) });

  if (!usuario) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  const passwordMatches = await comparePassword(input.contrasena, usuario.contrasena);

  if (!passwordMatches) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  await db.update(usuarios).set({ fechaUltimoLogeo: new Date() }).where(eq(usuarios.id, usuario.id));

  const token = signToken({ sub: usuario.id, rol: usuario.rol });

  return { token, usuario: toPublicUser(usuario) };
}

function toPublicUser(usuario: typeof usuarios.$inferSelect) {
  const { contrasena: _contrasena, ...publicUser } = usuario;
  return publicUser;
}

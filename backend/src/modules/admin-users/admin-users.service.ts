import { and, count, eq, ne, sql } from "drizzle-orm";

import { db } from "../../database/client";
import { usuarios } from "../../database/schema";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";

export async function deactivateUser(userId: number, authenticatedAdminId: number) {
  if (userId === authenticatedAdminId) {
    throw new ConflictError("No podés dar de baja tu propia cuenta de administrador");
  }

  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('contract:admin-user-deactivation'))`);

    const existing = await tx.query.usuarios.findFirst({ where: eq(usuarios.id, userId) });

    if (!existing) {
      throw new NotFoundError("Usuario no encontrado");
    }

    if (!existing.activo && existing.estadoRegistro === "suspendido") {
      return toAdminUser(existing);
    }

    if (existing.rol === "admin") {
      const [{ total } = { total: 0 }] = await tx
        .select({ total: count() })
        .from(usuarios)
        .where(
          and(
            eq(usuarios.rol, "admin"),
            eq(usuarios.activo, true),
            ne(usuarios.estadoRegistro, "suspendido"),
          ),
        );

      if (total <= 1) {
        throw new ConflictError("No se puede dar de baja al último administrador activo");
      }
    }

    const [updated] = await tx
      .update(usuarios)
      .set({ activo: false, estadoRegistro: "suspendido" })
      .where(eq(usuarios.id, userId))
      .returning();

    if (!updated) {
      throw new NotFoundError("Usuario no encontrado");
    }

    return toAdminUser(updated);
  });
}

function toAdminUser(usuario: typeof usuarios.$inferSelect) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    rol: usuario.rol,
    activo: usuario.activo,
    estadoRegistro: usuario.estadoRegistro,
  };
}

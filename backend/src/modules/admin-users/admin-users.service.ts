import { and, count, eq, ne, or, sql, type SQLWrapper } from "drizzle-orm";

import { db } from "../../database/client";
import { usuarios } from "../../database/schema";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";
import type { ListAdminUsersQuery, UpdateAdminUserInput } from "./admin-users.validation";

function normalizedText(column: SQLWrapper, term: string) {
  return sql`unaccent(${column}) ilike unaccent(${term}::text)`;
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function countActiveAdmins(tx: Tx) {
  const [{ total } = { total: 0 }] = await tx
    .select({ total: count() })
    .from(usuarios)
    .where(and(eq(usuarios.rol, "admin"), eq(usuarios.activo, true), ne(usuarios.estadoRegistro, "suspendido")));

  return total;
}

export async function listUsers(filters: ListAdminUsersQuery) {
  const conditions: SQLWrapper[] = [];

  if (filters.rol) {
    conditions.push(eq(usuarios.rol, filters.rol));
  }

  if (filters.search) {
    const term = `%${filters.search}%`;
    const searchCondition = or(
      normalizedText(usuarios.nombre, term),
      normalizedText(usuarios.apellido, term),
      normalizedText(sql`${usuarios.nombre} || ' ' || ${usuarios.apellido}`, term),
      normalizedText(usuarios.email, term),
    );

    if (searchCondition) conditions.push(searchCondition);
  }

  const rows = await db.query.usuarios.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: (fields, { asc }) => [asc(fields.nombre), asc(fields.apellido)],
  });

  return rows.map(toAdminUser);
}

export async function updateUser(userId: number, authenticatedAdminId: number, input: UpdateAdminUserInput) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('contract:admin-user-deactivation'))`);

    const existing = await tx.query.usuarios.findFirst({ where: eq(usuarios.id, userId) });

    if (!existing) {
      throw new NotFoundError("Usuario no encontrado");
    }

    const emailOwner = await tx.query.usuarios.findFirst({
      where: and(eq(usuarios.email, input.email), ne(usuarios.id, userId)),
    });

    if (emailOwner) {
      throw new ConflictError("Dato ya existente: el email pertenece a otro usuario.");
    }

    if (existing.rol === "admin" && input.rol !== "admin" && (await countActiveAdmins(tx)) <= 1) {
      throw new ConflictError("No se puede quitar el rol al último administrador activo");
    }

    const [updated] = await tx
      .update(usuarios)
      .set({
        nombre: input.nombre,
        apellido: input.apellido,
        email: input.email,
        telefono: input.telefono,
        rol: input.rol,
      })
      .where(eq(usuarios.id, userId))
      .returning();

    if (!updated) {
      throw new NotFoundError("Usuario no encontrado");
    }

    return toAdminUser(updated);
  });
}

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
    telefono: usuario.telefono,
    rol: usuario.rol,
    activo: usuario.activo,
    estadoRegistro: usuario.estadoRegistro,
  };
}

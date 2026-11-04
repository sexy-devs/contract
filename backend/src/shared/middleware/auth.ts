import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../database/client";
import { usuarios } from "../../database/schema";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError";
import { verifyToken, type JwtPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token no provisto");
  }

  const token = header.slice("Bearer ".length);
  let payload: JwtPayload;

  try {
    payload = verifyToken(token);
  } catch {
    throw new UnauthorizedError("Token inválido o expirado");
  }

  const usuario = await db.query.usuarios.findFirst({ where: eq(usuarios.id, payload.sub) });

  if (!usuario || !usuario.activo || usuario.estadoRegistro === "suspendido") {
    throw new UnauthorizedError("Token inválido o expirado");
  }

  req.user = { sub: usuario.id, rol: usuario.rol };
  next();
}

export function requireRole(...roles: JwtPayload["rol"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      throw new ForbiddenError();
    }

    next();
  };
}

import jwt from "jsonwebtoken";

import { env } from "../../config/env";

export type JwtPayload = {
  sub: number;
  rol: "cliente" | "profesional" | "admin";
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as unknown as JwtPayload;
}

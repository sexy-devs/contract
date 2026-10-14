import { apiClient } from "../../../lib/api";

export type LoginPayload = { email: string; password: string };

export type RegisterPayload = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  rol: "cliente" | "profesional";
};

export type AuthUser = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fotoUrl: string | null;
  rol: "cliente" | "profesional" | "admin";
};

export type AuthResponse = { token: string; usuario: AuthUser };

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/login", {
    email: payload.email,
    contrasena: payload.password,
  });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/registro", {
    nombre: payload.nombre,
    apellido: payload.apellido,
    email: payload.email,
    contrasena: payload.password,
    telefono: payload.telefono,
    rol: payload.rol,
  });
}

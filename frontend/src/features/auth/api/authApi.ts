import { apiClient } from "../../../lib/api";

export type LoginPayload = { email: string; password: string };

type BaseRegisterPayload = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
};

export type RegisterClientePayload = BaseRegisterPayload & {
  rol: "cliente";
  idLocalidad?: number;
};

export type RegisterProfesionalPayload = BaseRegisterPayload & {
  rol: "profesional";
  descripcion: string;
  aniosExperiencia: number;
  idLocalidad: number;
  aceptaRadioKm: number;
  disponibilidad: string;
  servicios: { idServ: number; monto: number }[];
};

export type RegisterPayload = RegisterClientePayload | RegisterProfesionalPayload;

export type AuthUser = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fotoUrl: string | null;
  idLocalidad: number | null;
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
  const { password, ...rest } = payload;
  return apiClient.post<AuthResponse>("/auth/registro", { ...rest, contrasena: password });
}

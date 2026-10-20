import { apiClient } from "../../../lib/api";

export type UserProfile = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  emailVerificado: boolean;
  telefono: string;
  fotoUrl: string | null;
  idLocalidad: number | null;
  latitud: number | null;
  longitud: number | null;
  fechaCreado: string;
  fechaUltimoLogeo: string | null;
  rol: "cliente" | "profesional" | "admin";
  activo: boolean;
  estadoRegistro: "pendiente" | "activo" | "suspendido";
};

export type UpdateProfilePayload = Partial<{
  nombre: string;
  apellido: string;
  telefono: string;
  fotoUrl: string;
  idLocalidad: number;
}>;

export function getMe(): Promise<UserProfile> {
  return apiClient.get<UserProfile>("/usuarios/me");
}

export function updateMe(payload: UpdateProfilePayload): Promise<UserProfile> {
  return apiClient.patch<UserProfile>("/usuarios/me", payload);
}

export function updateMyPhoto(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("foto", file);
  return apiClient.patch<UserProfile>("/usuarios/me/foto", formData);
}

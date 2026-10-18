import { apiClient } from "../../../lib/api";

export type ProviderProfile = {
  id: number;
  idUsuario: number;
  descripcion: string | null;
  aniosExperiencia: number;
  aceptaRadioKm: number;
  verificado: boolean;
  disponibilidad: string | null;
  trabajosPendientes: number;
  trabajosFinalizados: number;
  calificacionGlobal: number;
  cantidadCalificaciones: number;
};

export type UpdateProviderProfilePayload = Partial<{
  descripcion: string;
  aniosExperiencia: number;
  aceptaRadioKm: number;
  disponibilidad: string;
}>;

export type ServicioInput = { idServ: number; monto: number };

export type ServicioPropio = { id: number; idServ: number; nombre: string; monto: number };

export type EstadoMatricula = "pendiente" | "aprobada" | "rechazada";

export type Matricula = {
  id: number;
  fotoUrl: string;
  fechaExpiracion: string | null;
  estado: EstadoMatricula;
};

export function getMyProviderProfile(): Promise<ProviderProfile> {
  return apiClient.get<ProviderProfile>("/profesionales/me");
}

export function updateMyProviderProfile(payload: UpdateProviderProfilePayload): Promise<ProviderProfile> {
  return apiClient.patch<ProviderProfile>("/profesionales/me", payload);
}

export function getMyServices(): Promise<ServicioPropio[]> {
  return apiClient.get<ServicioPropio[]>("/profesionales/me/servicios");
}

export function replaceMyServices(servicios: ServicioInput[]): Promise<unknown> {
  return apiClient.put("/profesionales/me/servicios", { servicios });
}

export function getMyMatricula(): Promise<Matricula | null> {
  return apiClient.get<Matricula | null>("/profesionales/me/matricula");
}

export function uploadMyMatricula(file: File): Promise<Matricula> {
  const formData = new FormData();
  formData.append("documento", file);
  return apiClient.post<Matricula>("/profesionales/me/matricula", formData);
}

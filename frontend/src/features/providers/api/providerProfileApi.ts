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

export type ServicioOfrecido = { id: number; idProf: number; idServ: number; monto: number };

export type Matricula = {
  id: number;
  fotoUrl: string;
  fechaExpiracion: string | null;
  estado: string;
};

export function getMyProviderProfile(): Promise<ProviderProfile> {
  return apiClient.get<ProviderProfile>("/profesionales/me");
}

export function updateMyProviderProfile(payload: UpdateProviderProfilePayload): Promise<ProviderProfile> {
  return apiClient.patch<ProviderProfile>("/profesionales/me", payload);
}

export function replaceMyServices(servicios: ServicioInput[]): Promise<ServicioOfrecido[]> {
  return apiClient.put<ServicioOfrecido[]>("/profesionales/me/servicios", { servicios });
}

export function createMyMatricula(payload: { fotoUrl: string; fechaExpiracion?: string }): Promise<Matricula> {
  return apiClient.post<Matricula>("/profesionales/me/matricula", payload);
}

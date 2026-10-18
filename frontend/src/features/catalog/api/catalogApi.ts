import { apiClient } from "../../../lib/api";

export type ProviderRow = {
  id: number;
  nombre: string;
  apellido: string;
  fotoUrl: string | null;
  oficio: string | null;
  zona: string | null;
  calificacionGlobal: string | number | null;
  cantidadCalificaciones: number | null;
  verificado: boolean;
  disponibilidad: string | null;
  precioDesde: string | number | null;
};

export type SearchProvidersResponse = {
  data: ProviderRow[];
  pagination: { page: number; limit: number; total: number };
};

export type ProviderPublicProfile = {
  id: number;
  nombre: string | undefined;
  apellido: string | undefined;
  descripcion: string | null;
  aniosExperiencia: number;
  verificado: boolean;
  disponibilidad: string | null;
  trabajosFinalizados: number;
  calificacionGlobal: number;
  cantidadCalificaciones: number;
  servicios: { id: number; nombre: string; monto: number }[];
  matriculas: { estado: string; fechaExpiracion: string | null }[];
};

export type ServicioCatalogo = { id: number; nombre: string };

export function listServicios(): Promise<ServicioCatalogo[]> {
  return apiClient.get<ServicioCatalogo[]>("/catalogo/servicios");
}

export function listZones(): Promise<{ id: number; nombre: string }[]> {
  return apiClient.get<{ id: number; nombre: string }[]>("/catalogo/zonas");
}

export function searchProviders(params = ""): Promise<SearchProvidersResponse> {
  return apiClient.get<SearchProvidersResponse>(`/catalogo/profesionales${params}`);
}

export function getProviderPublicProfile(id: number): Promise<ProviderPublicProfile> {
  return apiClient.get<ProviderPublicProfile>(`/catalogo/profesionales/${id}`);
}

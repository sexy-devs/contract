import { apiClient } from "../../../lib/api";

export type ProviderRow = {
  id: number;
  nombre: string;
  apellido: string;
  fotoUrl: string | null;
  oficio: string | null;
  zona: string | null;
  provincia: string | null;
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
  fotoUrl: string | null;
  zona: string | null;
  provincia: string | null;
  descripcion: string | null;
  aniosExperiencia: number;
  aceptaRadioKm: number;
  verificado: boolean;
  disponibilidad: string | null;
  trabajosFinalizados: number;
  calificacionGlobal: number;
  cantidadCalificaciones: number;
  servicios: { id: number; nombre: string; monto: number }[];
  matriculas: { estado: string; fechaExpiracion: string | null }[];
  trabajos: { fecha: string }[];
  resenas: { autor: string; calificacion: number; comentario: string | null; fecha: string }[];
};

export type ServicioCatalogo = { id: number; nombre: string };
export type Localidad = { id: number; nombre: string; idProvincia: number };
export type Provincia = { id: number; nombre: string };

export function listServicios(): Promise<ServicioCatalogo[]> {
  return apiClient.get<ServicioCatalogo[]>("/catalogo/servicios");
}

export function listZones(): Promise<Localidad[]> {
  return apiClient.get<Localidad[]>("/catalogo/zonas");
}

export function listProvincias(): Promise<Provincia[]> {
  return apiClient.get<Provincia[]>("/catalogo/provincias");
}

export function searchProviders(params = ""): Promise<SearchProvidersResponse> {
  return apiClient.get<SearchProvidersResponse>(`/catalogo/profesionales${params}`);
}

export function getProviderPublicProfile(id: number): Promise<ProviderPublicProfile> {
  return apiClient.get<ProviderPublicProfile>(`/catalogo/profesionales/${id}`);
}

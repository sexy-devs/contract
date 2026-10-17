import { apiClient } from "../../../lib/api";

export type SearchProvidersParams = Partial<{
  servicio: string;
  zona: string;
  soloDisponibles: boolean;
  ordenarPor: "calificacion" | "precio" | "distancia";
  lat: number;
  lng: number;
  page: number;
  limit: number;
}>;

export type ProviderSearchResult = {
  id: number;
  nombre: string;
  apellido: string;
  descripcion: string | null;
  calificacionGlobal: number;
  cantidadCalificaciones: number;
  verificado: boolean;
  disponibilidad: string | null;
  zona: string | null;
  precioDesde: number | null;
  distanciaKm: number | null;
};

export type SearchProvidersResponse = {
  data: ProviderSearchResult[];
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

export function searchProviders(params: SearchProvidersParams = {}): Promise<SearchProvidersResponse> {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  }

  const queryString = query.toString();
  return apiClient.get<SearchProvidersResponse>(`/catalogo/profesionales${queryString ? `?${queryString}` : ""}`);
}

export function getProviderPublicProfile(id: number): Promise<ProviderPublicProfile> {
  return apiClient.get<ProviderPublicProfile>(`/catalogo/profesionales/${id}`);
}

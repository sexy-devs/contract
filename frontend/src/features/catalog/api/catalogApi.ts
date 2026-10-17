const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

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

export type ServiceOption = {
  id: number;
  nombre: string;
};

let servicesRequest: Promise<ServiceOption[]> | null = null;

export async function listZones(): Promise<{ id: number; nombre: string }[]> {
  const res = await fetch(`${API_URL}/api/catalogo/zonas`);
  if (!res.ok) throw new Error("No se pudieron cargar las zonas");
  return res.json();
}

export function listServices(): Promise<ServiceOption[]> {
  if (!servicesRequest) {
    servicesRequest = fetch(`${API_URL}/api/catalogo/servicios`).then(
      async (response) => {
        if (!response.ok) {
          throw new Error("No se pudieron cargar los servicios");
        }
        return response.json() as Promise<ServiceOption[]>;
      },
    ).catch((error) => {
      servicesRequest = null;
      throw error;
    });
  }

  return servicesRequest;
}

export async function searchProviders(params = "") {
  // fetch de datos para el populate del catálogo
  const res = await fetch(`${API_URL}/api/catalogo/profesionales${params}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "No se pudo cargar el catálogo");
  }
  return res.json() as Promise<{
    data: ProviderRow[];
    pagination: { page: number; limit: number; total: number };
  }>;
}

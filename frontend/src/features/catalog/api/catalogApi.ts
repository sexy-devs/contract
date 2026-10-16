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

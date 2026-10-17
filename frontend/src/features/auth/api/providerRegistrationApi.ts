export type ProfessionalProfilePayload = {
  descripcion?: string;
  aniosExperiencia: number;
  aceptaRadioKm: number;
  disponibilidad?: string;
};

export type ProfessionalServicePayload = {
  idServ: number;
  monto: number;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function authenticatedRequest(
  path: string,
  method: "PATCH" | "PUT",
  token: string,
  body: unknown,
) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody: { error?: unknown } = await response
      .json()
      .catch(() => ({}));
    throw new Error(
      typeof responseBody.error === "string"
        ? responseBody.error
        : "No se pudo completar el perfil profesional.",
    );
  }

  return response.json();
}

export function updateProfessionalProfile(
  token: string,
  payload: ProfessionalProfilePayload,
) {
  return authenticatedRequest(
    "/api/profesionales/me",
    "PATCH",
    token,
    payload,
  );
}

export function replaceProfessionalServices(
  token: string,
  services: ProfessionalServicePayload[],
) {
  return authenticatedRequest(
    "/api/profesionales/me/servicios",
    "PUT",
    token,
    { servicios: services },
  );
}

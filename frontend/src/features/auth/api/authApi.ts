export type LoginPayload = { email: string; password: string };
export type RegisterRole = "cliente" | "profesional";

export type RegisterPayload = {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  telefono: string;
  rol: RegisterRole;
};

export type AuthResponse = {
  token: string;
  usuario: {
    id: number;
    email: string;
    rol: RegisterRole | "admin";
  };
};

export type LoginResponse = AuthResponse;

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body: { error?: unknown } = await response.json().catch(() => ({}));
    const message =
      typeof body.error === "string"
        ? body.error
        : "No se pudo crear la cuenta.";
    throw new Error(message);
  }

  return response.json();
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email,
      contrasena: payload.password,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Fallo al iniciar sesión, credenciales inválidas");
  }
  return res.json();
}

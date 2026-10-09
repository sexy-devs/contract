export type LoginPayload = { email: string; password: string };
export type LoginResponse = { token: string; user: { id: string; email: string } };

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message + "Fallo al iniciar sesion, credenciales inválidas");
  }
  return res.json();
}
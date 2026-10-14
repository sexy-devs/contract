export type LoginPayload = { email: string; password: string };
export type LoginResponse = { token: string; user: { id: number; email: string } };

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

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
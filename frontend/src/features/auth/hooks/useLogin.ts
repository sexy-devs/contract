import { useState } from "react";
import { login, type LoginPayload } from "../api/authApi";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: LoginPayload) {
    setLoading(true);
    setError(null);

    try {
      const data = await login(payload);
      localStorage.setItem("token", data.token);
      return data;
    } catch {
      setError("Credenciales inválidas.");
      return;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}

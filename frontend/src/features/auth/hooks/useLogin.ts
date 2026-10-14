import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../../lib/api";
import { login, type LoginPayload } from "../api/authApi";

export function useLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: LoginPayload) {
    setLoading(true);
    setError(null);

    try {
      const data = await login(payload);
      localStorage.setItem("token", data.token);
      navigate("/");
      return data;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor.");
      return;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}

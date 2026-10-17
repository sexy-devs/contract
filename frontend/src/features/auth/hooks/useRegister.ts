import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  register,
  type RegisterPayload,
} from "../api/authApi";

export function useRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: RegisterPayload) {
    setLoading(true);
    setError(null);

    try {
      const data = await register(payload);
      localStorage.setItem("token", data.token);
      navigate("/catalogo");
      return data;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "No se pudo crear la cuenta.";
      setError(message);
      return undefined;
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    setError(null);
  }

  return { submit, loading, error, clearError };
}

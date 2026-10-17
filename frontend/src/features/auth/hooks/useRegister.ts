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
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  async function submit(
    payload: RegisterPayload,
    afterRegister?: (token: string) => Promise<void>,
  ) {
    setLoading(true);
    setError(null);

    try {
      let token = createdToken;

      if (!token) {
        const data = await register(payload);
        token = data.token;
        localStorage.setItem("token", token);
        setCreatedToken(token);
      }

      if (afterRegister) {
        try {
          await afterRegister(token);
        } catch (setupError) {
          const detail =
            setupError instanceof Error ? setupError.message : "Error desconocido";
          throw new Error(
            `La cuenta fue creada, pero faltó completar el perfil: ${detail}`,
            { cause: setupError },
          );
        }
      }

      setCreatedToken(null);
      navigate("/catalogo");
      return true;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "No se pudo crear la cuenta.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    setError(null);
  }

  return {
    submit,
    loading,
    error,
    clearError,
    accountCreated: Boolean(createdToken),
  };
}

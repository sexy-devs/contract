import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../../lib/api";
import { uploadMyMatricula } from "../../providers/api/providerProfileApi";
import { updateMyPhoto } from "../../profile/api/usersApi";
import { register, type RegisterPayload } from "../api/authApi";

type SubmitExtras = { fotoPerfil?: File | null; documentacion?: File | null };

export function useRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: RegisterPayload, extras: SubmitExtras = {}) {
    setLoading(true);
    setError(null);

    try {
      const data = await register(payload);
      localStorage.setItem("token", data.token);

      if (extras.fotoPerfil) {
        try {
          await updateMyPhoto(extras.fotoPerfil);
        } catch {
          // la cuenta ya se creó; la foto se puede cambiar después desde el perfil
        }
      }

      if (payload.rol === "profesional" && extras.documentacion) {
        try {
          await uploadMyMatricula(extras.documentacion);
        } catch {
          // la cuenta ya se creó; la matrícula se puede cargar después desde el perfil
        }
      }

      navigate("/catalogo");
      return data;
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "No se pudo crear la cuenta.");
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

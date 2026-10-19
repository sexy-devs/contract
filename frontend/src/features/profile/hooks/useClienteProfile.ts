import { useEffect, useState } from "react";
import { ApiError } from "../../../lib/api";
import { getMe, updateMe, updateMyPhoto, type UserProfile } from "../api/usersApi";

type FormState = {
  nombre: string;
  apellido: string;
  telefono: string;
};
type FormErrors = Partial<Record<keyof FormState, string>> & { idLocalidad?: string };

const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü'\s-]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{6,30}$/;

const emptyForm: FormState = { nombre: "", apellido: "", telefono: "" };

export function useClienteProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [idLocalidad, setIdLocalidad] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => {
        setProfile(data);
        setForm({ nombre: data.nombre, apellido: data.apellido, telefono: data.telefono });
        setIdLocalidad(data.idLocalidad);
      })
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : "No se pudo cargar el perfil."))
      .finally(() => setLoading(false));
  }, []);

  function setField(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function setLocalidad(value: number | null) {
    setIdLocalidad(value);
    setSaved(false);
  }

  function validate() {
    const next: FormErrors = {};
    if (!form.nombre.trim()) next.nombre = "Este campo es obligatorio.";
    else if (!NAME_PATTERN.test(form.nombre)) next.nombre = "Solo se permiten letras y espacios.";

    if (!form.apellido.trim()) next.apellido = "Este campo es obligatorio.";
    else if (!NAME_PATTERN.test(form.apellido)) next.apellido = "Solo se permiten letras y espacios.";

    if (!form.telefono.trim()) next.telefono = "Este campo es obligatorio.";
    else if (!PHONE_PATTERN.test(form.telefono)) next.telefono = "Formato de teléfono inválido.";

    if (idLocalidad == null) next.idLocalidad = "Seleccioná tu localidad.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function save() {
    if (!validate()) return;

    setSaving(true);
    setSubmitError(null);

    try {
      const updated = await updateMe({
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        idLocalidad: idLocalidad ?? undefined,
      });
      setProfile(updated);
      setSaved(true);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhoto(file: File) {
    setUploadingPhoto(true);
    setSubmitError(null);

    try {
      const updated = await updateMyPhoto(file);
      setProfile(updated);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "No se pudo actualizar la foto.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  function dismissSaved() {
    setSaved(false);
  }

  return {
    profile,
    form,
    idLocalidad,
    errors,
    loading,
    loadError,
    saving,
    saved,
    submitError,
    uploadingPhoto,
    setField,
    setLocalidad,
    save,
    uploadPhoto,
    dismissSaved,
  };
}

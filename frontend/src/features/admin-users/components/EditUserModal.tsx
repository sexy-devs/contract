import { useState } from "react";

import { ApiError } from "../../../lib/api";
import { updateUser, type AdminUser, type AdminUserRole } from "../api/adminUsersApi";
import ProfileField from "../../profile/components/ProfileField";
import { hasEditUserErrors, validateEditUserForm, type EditUserErrors, type EditUserForm } from "../editUserValidation";

const rolOptions: { value: AdminUserRole; label: string }[] = [
  { value: "cliente", label: "Cliente" },
  { value: "profesional", label: "Prestador" },
  { value: "admin", label: "Administrador" },
];

type Props = {
  user: AdminUser;
  onClose: () => void;
  onUpdated: (user: AdminUser) => void;
};

function EditUserModal({ user, onClose, onUpdated }: Props) {
  const [form, setForm] = useState<EditUserForm>({
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    telefono: user.telefono,
    rol: user.rol,
  });
  const [errors, setErrors] = useState<EditUserErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function setField(field: keyof EditUserForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const validationErrors = validateEditUserForm(form);
    setErrors(validationErrors);

    if (hasEditUserErrors(validationErrors)) {
      const hasIncomplete = Object.values(validationErrors).some((message) => message === "Campo obligatorio.");
      setSubmitError(
        hasIncomplete
          ? "Completá todos los campos para guardar los cambios."
          : "No se pudo guardar. Corregí los campos marcados.",
      );
      return;
    }

    setSubmitError(null);
    setSaving(true);

    try {
      const updated = await updateUser(user.id, {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        rol: form.rol as AdminUserRole,
      });
      onUpdated(updated);
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 409) {
        setSubmitError(caughtError.message);
        setErrors((prev) => ({ ...prev, email: "Este email ya está registrado por otro usuario." }));
      } else if (caughtError instanceof ApiError && caughtError.status === 400) {
        setSubmitError("No se pudo guardar. Corregí los campos marcados.");
      } else {
        setSubmitError(caughtError instanceof ApiError ? caughtError.message : "No se pudo guardar el usuario.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900">Editar usuario</h2>
        <p className="mt-1 text-gray-600">
          Modificá los datos y el rol de {user.nombre} {user.apellido}.
        </p>

        {submitError && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {submitError}
          </p>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ProfileField
            id="edit-nombre"
            label="Nombre"
            required
            value={form.nombre}
            onChange={(v) => setField("nombre", v)}
            error={errors.nombre}
          />
          <ProfileField
            id="edit-apellido"
            label="Apellido"
            required
            value={form.apellido}
            onChange={(v) => setField("apellido", v)}
            error={errors.apellido}
          />
        </div>

        <div className="mt-4">
          <ProfileField
            id="edit-email"
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(v) => setField("email", v)}
            error={errors.email}
          />
        </div>

        <div className="mt-4">
          <ProfileField
            id="edit-telefono"
            label="Teléfono"
            type="tel"
            required
            value={form.telefono}
            onChange={(v) => setField("telefono", v)}
            error={errors.telefono}
          />
        </div>

        <div className="mt-4">
          <ProfileField
            id="edit-rol"
            label="Rol"
            type="select"
            required
            value={form.rol}
            onChange={(v) => setField("rol", v)}
            error={errors.rol}
            options={rolOptions}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-200 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUserModal;

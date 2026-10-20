import { useEffect, useState } from "react";
import Toast from "../../../components/ui/Toast";
import { useLocationCatalog } from "../../catalog/hooks/useLocationCatalog";
import { useClienteProfile } from "../hooks/useClienteProfile";
import ProfileField from "./ProfileField";
import ProfilePhoto from "./ProfilePhoto";

function ClienteProfile() {
  const {
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
  } = useClienteProfile();

  const { provincias, localidades, loading: loadingUbicacion } = useLocationCatalog();
  const [idProvincia, setIdProvincia] = useState<number | "">("");

  useEffect(() => {
    if (idLocalidad == null || localidades.length === 0) return;
    const localidad = localidades.find((l) => l.id === idLocalidad);
    if (localidad) setIdProvincia(localidad.idProvincia);
  }, [idLocalidad, localidades]);

  const localidadesFiltradas = idProvincia === "" ? [] : localidades.filter((l) => l.idProvincia === idProvincia);

  if (loading) {
    return <p className="text-gray-600">Cargando perfil...</p>;
  }

  if (loadError || !profile) {
    return <p className="text-red-600">{loadError ?? "No se pudo cargar el perfil."}</p>;
  }

  const initials = `${profile.nombre[0] ?? ""}${profile.apellido[0] ?? ""}`.toUpperCase();

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Mi perfil</h1>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800">Cliente</span>
        </div>
        <p className="mt-1 text-gray-600">Gestioná tus datos personales, de contacto y tu domicilio.</p>
      </header>

      {submitError && <p className="mt-4 text-sm font-medium text-red-600">{submitError}</p>}

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <p className="text-xs font-semibold text-sky-800">01 · Información personal</p>

        <div className="mt-4">
          <ProfilePhoto
            fotoUrl={profile.fotoUrl}
            initials={initials}
            description="Se muestra a los profesionales que contrates."
            uploading={uploadingPhoto}
            onSelectFile={uploadPhoto}
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ProfileField
            id="nombre"
            label="Nombre"
            required
            value={form.nombre}
            onChange={(v) => setField("nombre", v)}
            error={errors.nombre}
          />
          <ProfileField
            id="apellido"
            label="Apellido"
            required
            value={form.apellido}
            onChange={(v) => setField("apellido", v)}
            error={errors.apellido}
          />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <p className="text-xs font-semibold text-sky-800">02 · Información de contacto</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ProfileField id="email" label="Email" type="email" value={profile.email} onChange={() => {}} disabled />
          <ProfileField
            id="telefono"
            label="Teléfono"
            type="tel"
            required
            value={form.telefono}
            onChange={(v) => setField("telefono", v)}
            error={errors.telefono}
          />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <p className="text-xs font-semibold text-sky-800">03 · Domicilio</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ProfileField
            id="provincia"
            label="Provincia"
            type="select"
            required
            placeholder={loadingUbicacion ? "Cargando..." : "Seleccionar provincia"}
            value={String(idProvincia)}
            onChange={(v) => {
              setIdProvincia(v === "" ? "" : Number(v));
              setLocalidad(null);
            }}
            disabled={loadingUbicacion}
            options={provincias.map((p) => ({ value: p.id, label: p.nombre }))}
          />
          <ProfileField
            id="localidad"
            label="Localidad"
            type="select"
            required
            placeholder="Seleccionar localidad"
            value={idLocalidad != null ? String(idLocalidad) : ""}
            onChange={(v) => setLocalidad(v === "" ? null : Number(v))}
            disabled={loadingUbicacion || idProvincia === ""}
            error={errors.idLocalidad}
            options={localidadesFiltradas.map((l) => ({ value: l.id, label: l.nombre }))}
          />
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      <Toast show={saved} message="Cambios guardados correctamente." onDismiss={dismissSaved} />
    </div>
  );
}

export default ClienteProfile;

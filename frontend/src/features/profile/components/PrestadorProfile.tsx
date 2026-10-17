import { usePrestadorProfile } from "../hooks/usePrestadorProfile";
import MatriculaCard from "./MatriculaCard";
import ProfileField from "./ProfileField";
import ServiciosEditor from "./ServiciosEditor";

const TABS = ["Datos personales", "Información profesional", "Cobertura y disponibilidad", "Matrícula / Documentación", "Servicios ofrecidos"];

function PrestadorProfile() {
  const {
    usuario,
    provider,
    catalogo,
    matricula,
    loading,
    loadError,
    activeTab,
    setActiveTab,
    uploadingPhoto,
    uploadPhoto,
    personalForm,
    personalErrors,
    personalSaving,
    personalSaved,
    setPersonalField,
    savePersonal,
    professionalForm,
    professionalSaving,
    professionalSaved,
    setProfessionalField,
    saveProfessional,
    coverageForm,
    coverageSaving,
    coverageSaved,
    setCoverageField,
    saveCoverage,
    servicios,
    serviciosSaving,
    serviciosSaved,
    serviciosError,
    addServicio,
    removeServicio,
    setServicioField,
    saveServicios,
    matriculaUploading,
    matriculaError,
    uploadMatricula,
  } = usePrestadorProfile();

  if (loading) {
    return <p className="text-gray-600">Cargando perfil...</p>;
  }

  if (loadError || !usuario || !provider) {
    return <p className="text-red-600">{loadError ?? "No se pudo cargar el perfil."}</p>;
  }

  const initials = `${usuario.nombre[0] ?? ""}${usuario.apellido[0] ?? ""}`.toUpperCase();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-50 bg-cover bg-center text-base font-semibold text-sky-800"
              style={usuario.fotoUrl ? { backgroundImage: `url(${usuario.fotoUrl})` } : undefined}
            >
              {!usuario.fotoUrl && initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-gray-900">
                  {usuario.nombre} {usuario.apellido}
                </p>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800">Profesional</span>
              </div>
              <p className="text-sm text-gray-600">
                {usuario.email} · {usuario.telefono}
              </p>
            </div>
          </div>

          <label className="inline-block cursor-pointer rounded-lg border-2 border-gray-200 px-3 py-1.5 text-sm font-medium text-sky-800 hover:border-sky-300">
            {uploadingPhoto ? "Subiendo..." : "Cambiar foto"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingPhoto}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadPhoto(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <div className="lg:grid lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-2 overflow-x-auto border-b border-gray-200 p-4 lg:flex-col lg:border-b-0 lg:border-r">
            {TABS.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`shrink-0 rounded-lg px-3 py-2 text-left text-sm font-medium ${
                  activeTab === index ? "bg-blue-50 text-sky-800" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {String(index + 1).padStart(2, "0")} · {tab}
              </button>
            ))}
          </nav>

          <div className="p-6">
            {activeTab === 0 && (
              <div>
                <h2 className="font-semibold text-gray-900">Datos personales</h2>
                <p className="text-sm text-gray-600">Nombre y datos de contacto.</p>

                {personalSaved && <p className="mt-4 text-sm font-medium text-green-700">✓ Cambios guardados correctamente.</p>}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <ProfileField
                    id="pr-nombre"
                    label="Nombre"
                    required
                    value={personalForm.nombre}
                    onChange={(v) => setPersonalField("nombre", v)}
                    error={personalErrors.nombre}
                  />
                  <ProfileField
                    id="pr-apellido"
                    label="Apellido"
                    required
                    value={personalForm.apellido}
                    onChange={(v) => setPersonalField("apellido", v)}
                    error={personalErrors.apellido}
                  />
                  <ProfileField id="pr-email" label="Email" type="email" value={usuario.email} onChange={() => {}} disabled />
                  <ProfileField
                    id="pr-telefono"
                    label="Teléfono"
                    type="tel"
                    required
                    value={personalForm.telefono}
                    onChange={(v) => setPersonalField("telefono", v)}
                    error={personalErrors.telefono}
                  />
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={savePersonal}
                    disabled={personalSaving}
                    className="rounded-lg bg-sky-800 px-5 py-2.5 font-semibold text-white hover:bg-sky-900 disabled:opacity-60"
                  >
                    {personalSaving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div>
                <h2 className="font-semibold text-gray-900">Información profesional</h2>
                <p className="text-sm text-gray-600">Cómo te presentás ante los clientes.</p>

                {professionalSaved && <p className="mt-4 text-sm font-medium text-green-700">✓ Cambios guardados correctamente.</p>}

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <ProfileField
                    id="pr-descripcion"
                    label="Descripción profesional"
                    type="textarea"
                    placeholder="Contá brevemente tu experiencia y especialidad"
                    value={professionalForm.descripcion}
                    onChange={(v) => setProfessionalField("descripcion", v)}
                    className="sm:col-span-3"
                  />
                  <ProfileField
                    id="pr-experiencia"
                    label="Años de experiencia"
                    type="number"
                    value={professionalForm.aniosExperiencia}
                    onChange={(v) => setProfessionalField("aniosExperiencia", v)}
                  />
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={saveProfessional}
                    disabled={professionalSaving}
                    className="rounded-lg bg-sky-800 px-5 py-2.5 font-semibold text-white hover:bg-sky-900 disabled:opacity-60"
                  >
                    {professionalSaving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div>
                <h2 className="font-semibold text-gray-900">Cobertura y disponibilidad</h2>
                <p className="text-sm text-gray-600">Dónde y cuándo ofrecés tus servicios.</p>

                {coverageSaved && <p className="mt-4 text-sm font-medium text-green-700">✓ Cambios guardados correctamente.</p>}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <ProfileField
                    id="pr-radio"
                    label="Radio de cobertura"
                    type="number"
                    suffix="km"
                    value={coverageForm.aceptaRadioKm}
                    onChange={(v) => setCoverageField("aceptaRadioKm", v)}
                  />
                  <ProfileField
                    id="pr-disponibilidad"
                    label="Disponibilidad"
                    placeholder="Ej.: lunes a viernes, 9 a 18 h"
                    value={coverageForm.disponibilidad}
                    onChange={(v) => setCoverageField("disponibilidad", v)}
                  />
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={saveCoverage}
                    disabled={coverageSaving}
                    className="rounded-lg bg-sky-800 px-5 py-2.5 font-semibold text-white hover:bg-sky-900 disabled:opacity-60"
                  >
                    {coverageSaving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div>
                <h2 className="font-semibold text-gray-900">Matrícula / Documentación</h2>
                <p className="text-sm text-gray-600">Acreditación de tu experiencia profesional.</p>

                <div className="mt-4">
                  <MatriculaCard matricula={matricula} uploading={matriculaUploading} error={matriculaError} onUpload={uploadMatricula} />
                </div>
              </div>
            )}

            {activeTab === 4 && (
              <div>
                <h2 className="font-semibold text-gray-900">Servicios ofrecidos</h2>
                <p className="mt-1 text-sm text-gray-600">Servicios asociados a tu perfil y su monto.</p>

                <div className="mt-4">
                  <ServiciosEditor
                    servicios={servicios}
                    catalogo={catalogo}
                    saving={serviciosSaving}
                    saved={serviciosSaved}
                    error={serviciosError}
                    onAdd={addServicio}
                    onRemove={removeServicio}
                    onChange={setServicioField}
                    onSave={saveServicios}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrestadorProfile;

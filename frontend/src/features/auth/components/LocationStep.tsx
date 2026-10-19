import { useEffect, useState } from "react";
import { useLocationCatalog } from "../../catalog/hooks/useLocationCatalog";

export type LocationData = {
  idLocalidad: number | null;
};

type Props = {
  data: LocationData;
  errors: Partial<Record<keyof LocationData, string>>;
  onChange: (field: keyof LocationData, value: number | null) => void;
};

const inputClass =
  "w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 font-normal text-gray-900 outline-none placeholder:text-gray-400 focus:border-sky-800";

function LocationStep({ data, errors, onChange }: Props) {
  const { provincias, localidades, loading } = useLocationCatalog();
  const [idProvincia, setIdProvincia] = useState<number | "">("");

  useEffect(() => {
    if (data.idLocalidad == null || localidades.length === 0) return;
    const localidad = localidades.find((l) => l.id === data.idLocalidad);
    if (localidad) setIdProvincia(localidad.idProvincia);
  }, [data.idLocalidad, localidades]);

  const localidadesFiltradas = idProvincia === "" ? [] : localidades.filter((l) => l.idProvincia === idProvincia);

  return (
    <section aria-labelledby="location-title">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-sky-800">
          02
        </span>
        <h2 id="location-title" className="text-lg font-bold text-gray-900">
          Ubicación
        </h2>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="font-semibold text-gray-900">
          Provincia
          <select
            value={idProvincia}
            onChange={(event) => {
              setIdProvincia(event.target.value === "" ? "" : Number(event.target.value));
              onChange("idLocalidad", null);
            }}
            disabled={loading}
            className={`${inputClass} mt-1.5`}
          >
            <option value="">{loading ? "Cargando..." : "Seleccionar provincia"}</option>
            {provincias.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="font-semibold text-gray-900">
          Localidad
          <select
            value={data.idLocalidad ?? ""}
            onChange={(event) => onChange("idLocalidad", event.target.value === "" ? null : Number(event.target.value))}
            disabled={loading || idProvincia === ""}
            className={`${inputClass} mt-1.5 ${errors.idLocalidad ? "border-red-500" : ""}`}
          >
            <option value="">Seleccionar localidad</option>
            {localidadesFiltradas.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nombre}
              </option>
            ))}
          </select>
          {errors.idLocalidad && (
            <span className="mt-1 block text-sm font-normal text-red-600">{errors.idLocalidad}</span>
          )}
        </label>
      </div>
    </section>
  );
}

export default LocationStep;

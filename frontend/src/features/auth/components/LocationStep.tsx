export type LocationData = {
  direccion: string;
  ciudad: string;
  codigoPostal: string;
};

type Props = {
  data: LocationData;
  errors: Partial<Record<keyof LocationData, string>>;
  onChange: (field: keyof LocationData, value: string) => void;
};

const inputClass =
  "w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 font-normal text-gray-900 outline-none placeholder:text-gray-400 focus:border-sky-800";

function LocationStep({ data, errors, onChange }: Props) {
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
        <label className="font-semibold text-gray-900 md:col-span-2">
          Dirección
          <input
            type="text"
            value={data.direccion}
            onChange={(event) => onChange("direccion", event.target.value)}
            placeholder="Calle y número"
            autoComplete="street-address"
            maxLength={200}
            aria-invalid={Boolean(errors.direccion)}
            aria-describedby={errors.direccion ? "address-error" : undefined}
            className={`${inputClass} mt-1.5 ${errors.direccion ? "border-red-500" : ""}`}
          />
          {errors.direccion && (
            <span id="address-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.direccion}
            </span>
          )}
        </label>

        <label className="font-semibold text-gray-900">
          Ciudad
          <input
            type="text"
            value={data.ciudad}
            onChange={(event) => onChange("ciudad", event.target.value)}
            autoComplete="address-level2"
            maxLength={100}
            aria-invalid={Boolean(errors.ciudad)}
            aria-describedby={errors.ciudad ? "client-city-error" : undefined}
            className={`${inputClass} mt-1.5 ${errors.ciudad ? "border-red-500" : ""}`}
          />
          {errors.ciudad && (
            <span id="client-city-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.ciudad}
            </span>
          )}
        </label>

        <label className="font-semibold text-gray-900">
          Código postal
          <input
            type="text"
            value={data.codigoPostal}
            onChange={(event) => onChange("codigoPostal", event.target.value)}
            autoComplete="postal-code"
            maxLength={10}
            aria-invalid={Boolean(errors.codigoPostal)}
            aria-describedby={errors.codigoPostal ? "postal-code-error" : undefined}
            className={`${inputClass} mt-1.5 ${errors.codigoPostal ? "border-red-500" : ""}`}
          />
          {errors.codigoPostal && (
            <span id="postal-code-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.codigoPostal}
            </span>
          )}
        </label>
      </div>
    </section>
  );
}

export default LocationStep;

export type CoverageData = {
  ciudad: string;
  aceptaRadioKm: string;
  disponibilidad: string;
};

type Props = {
  data: CoverageData;
  errors: Partial<Record<keyof CoverageData, string>>;
  onChange: (field: keyof CoverageData, value: string) => void;
};

const inputClass =
  "w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 font-normal text-gray-900 outline-none placeholder:text-gray-400 focus:border-sky-800";

function CoverageAvailabilityStep({ data, errors, onChange }: Props) {
  return (
    <section aria-labelledby="coverage-title">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-sky-800">
          03
        </span>
        <h2 id="coverage-title" className="text-lg font-bold text-gray-900">
          Cobertura y disponibilidad
        </h2>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="font-semibold text-gray-900">
          Ciudad
          <input
            type="text"
            value={data.ciudad}
            onChange={(event) => onChange("ciudad", event.target.value)}
            autoComplete="address-level2"
            maxLength={100}
            aria-invalid={Boolean(errors.ciudad)}
            aria-describedby={errors.ciudad ? "coverage-city-error" : undefined}
            className={`${inputClass} mt-1.5 ${errors.ciudad ? "border-red-500" : ""}`}
          />
          {errors.ciudad && (
            <span id="coverage-city-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.ciudad}
            </span>
          )}
        </label>

        <label className="font-semibold text-gray-900">
          Radio de cobertura
          <span className="relative mt-1.5 block">
            <input
              type="number"
              value={data.aceptaRadioKm}
              onChange={(event) =>
                onChange("aceptaRadioKm", event.target.value)
              }
              min={0}
              max={200}
              step={1}
              inputMode="numeric"
              aria-invalid={Boolean(errors.aceptaRadioKm)}
              aria-describedby={errors.aceptaRadioKm ? "coverage-radius-error" : undefined}
              className={`${inputClass} pr-12 ${errors.aceptaRadioKm ? "border-red-500" : ""}`}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-normal text-gray-500">
              km
            </span>
          </span>
          {errors.aceptaRadioKm && (
            <span id="coverage-radius-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.aceptaRadioKm}
            </span>
          )}
        </label>

        <label className="font-semibold text-gray-900 md:col-span-2">
          Disponibilidad
          <input
            type="text"
            value={data.disponibilidad}
            onChange={(event) =>
              onChange("disponibilidad", event.target.value)
            }
            placeholder="Ej.: lunes a viernes, 9 a 18 h"
            maxLength={200}
            aria-invalid={Boolean(errors.disponibilidad)}
            aria-describedby={errors.disponibilidad ? "availability-error" : undefined}
            className={`${inputClass} mt-1.5 ${errors.disponibilidad ? "border-red-500" : ""}`}
          />
          {errors.disponibilidad && (
            <span id="availability-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.disponibilidad}
            </span>
          )}
        </label>
      </div>
    </section>
  );
}

export default CoverageAvailabilityStep;

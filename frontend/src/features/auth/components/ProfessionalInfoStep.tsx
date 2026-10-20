export type ProfessionalInfoData = {
  descripcion: string;
  aniosExperiencia: string;
};

type Props = {
  data: ProfessionalInfoData;
  errors: Partial<Record<keyof ProfessionalInfoData, string>>;
  onChange: (field: keyof ProfessionalInfoData, value: string) => void;
};

const inputClass =
  "w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 font-normal text-gray-900 outline-none placeholder:text-gray-400 focus:border-sky-800";

function ProfessionalInfoStep({ data, errors, onChange }: Props) {
  return (
    <section aria-labelledby="professional-info-title">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-sky-800">
          02
        </span>
        <h2
          id="professional-info-title"
          className="text-lg font-bold text-gray-900"
        >
          Información profesional
        </h2>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="font-semibold text-gray-900">
          Descripción profesional
          <textarea
            value={data.descripcion}
            onChange={(event) => onChange("descripcion", event.target.value)}
            placeholder="Contá brevemente tu experiencia y especialidad"
            maxLength={500}
            rows={4}
            aria-invalid={Boolean(errors.descripcion)}
            aria-describedby={errors.descripcion ? "description-error" : undefined}
            className={`${inputClass} mt-1.5 resize-y ${errors.descripcion ? "border-red-500" : ""}`}
          />
          {errors.descripcion && (
            <span id="description-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.descripcion}
            </span>
          )}
        </label>

        <label className="max-w-xs font-semibold text-gray-900">
          Años de experiencia
          <input
            type="number"
            value={data.aniosExperiencia}
            onChange={(event) =>
              onChange("aniosExperiencia", event.target.value)
            }
            min={0}
            max={100}
            step={1}
            inputMode="numeric"
            aria-invalid={Boolean(errors.aniosExperiencia)}
            aria-describedby={errors.aniosExperiencia ? "experience-error" : undefined}
            className={`${inputClass} mt-1.5 ${errors.aniosExperiencia ? "border-red-500" : ""}`}
          />
          {errors.aniosExperiencia && (
            <span id="experience-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.aniosExperiencia}
            </span>
          )}
        </label>
      </div>
    </section>
  );
}

export default ProfessionalInfoStep;

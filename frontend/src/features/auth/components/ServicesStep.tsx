import type { ServiceOption } from "../../catalog/api/catalogApi";

export type OfferedServiceData = {
  idServ: string;
  monto: string;
};

type Props = {
  data: OfferedServiceData[];
  errors: Array<Partial<Record<keyof OfferedServiceData, string>>>;
  options: ServiceOption[];
  loadingOptions: boolean;
  catalogError: string;
  onChange: (services: OfferedServiceData[]) => void;
};

const fieldClass =
  "w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2.5 font-normal text-gray-900 outline-none focus:border-sky-800";

function ServicesStep({
  data,
  errors,
  options,
  loadingOptions,
  catalogError,
  onChange,
}: Props) {
  function updateService(
    index: number,
    field: keyof OfferedServiceData,
    value: string,
  ) {
    onChange(
      data.map((service, currentIndex) =>
        currentIndex === index ? { ...service, [field]: value } : service,
      ),
    );
  }

  function addService() {
    onChange([...data, { idServ: "", monto: "0" }]);
  }

  function removeService(index: number) {
    onChange(data.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <section aria-labelledby="services-title">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-sky-800">
          04
        </span>
        <h2 id="services-title" className="text-lg font-bold text-gray-900">
          Servicios
        </h2>
      </div>

      <fieldset className="mt-5">
        <legend className="font-semibold text-gray-900">
          Servicios ofrecidos y monto de cada servicio
        </legend>

        <div className="mt-2 space-y-3">
          {data.map((service, index) => (
            <div
              key={index}
              className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_9rem_auto]"
            >
              <label className="text-sm text-gray-600">
                Servicio ofrecido
                <select
                  value={service.idServ}
                  disabled={loadingOptions || Boolean(catalogError)}
                  onChange={(event) =>
                    updateService(index, "idServ", event.target.value)
                  }
                  aria-invalid={Boolean(errors[index]?.idServ)}
                  aria-describedby={
                    errors[index]?.idServ
                      ? `service-${index}-error`
                      : undefined
                  }
                  className={`${fieldClass} mt-1.5 ${errors[index]?.idServ ? "border-red-500" : ""}`}
                >
                  <option value="">
                    {loadingOptions ? "Cargando servicios..." : "Seleccionar servicio"}
                  </option>
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.nombre}
                    </option>
                  ))}
                </select>
                {errors[index]?.idServ && (
                  <span
                    id={`service-${index}-error`}
                    className="mt-1 block text-sm text-red-600"
                  >
                    {errors[index].idServ}
                  </span>
                )}
              </label>

              <label className="text-sm text-gray-600">
                Monto
                <span className="relative mt-1.5 block">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center font-normal text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={service.monto}
                    onChange={(event) =>
                      updateService(index, "monto", event.target.value)
                    }
                    min={0}
                    step={1}
                    inputMode="numeric"
                    aria-invalid={Boolean(errors[index]?.monto)}
                    aria-describedby={
                      errors[index]?.monto
                        ? `amount-${index}-error`
                        : undefined
                    }
                    className={`${fieldClass} pl-7 ${errors[index]?.monto ? "border-red-500" : ""}`}
                  />
                </span>
                {errors[index]?.monto && (
                  <span
                    id={`amount-${index}-error`}
                    className="mt-1 block text-sm text-red-600"
                  >
                    {errors[index].monto}
                  </span>
                )}
              </label>

              {data.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  aria-label={`Quitar servicio ${index + 1}`}
                  className="rounded-lg border border-gray-300 px-3 py-2.5 font-semibold text-gray-600 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800"
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addService}
          className="mt-3 w-full rounded-lg border border-dashed border-sky-300 px-4 py-2.5 font-semibold text-sky-800 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800"
        >
          + Agregar servicio
        </button>

        {catalogError ? (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {catalogError}
          </p>
        ) : options.length === 0 && !loadingOptions ? (
          <p className="mt-2 text-sm text-gray-500">
            No hay servicios disponibles en el catálogo.
          </p>
        ) : null}
      </fieldset>
    </section>
  );
}

export default ServicesStep;

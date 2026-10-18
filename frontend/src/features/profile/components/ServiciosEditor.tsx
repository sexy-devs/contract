import type { ServicioCatalogo } from "../../catalog/api/catalogApi";

type ServicioRow = { localId: number; idServ: string; monto: string };

type Props = {
  servicios: ServicioRow[];
  catalogo: ServicioCatalogo[];
  saving?: boolean;
  saved?: boolean;
  error?: string | null;
  onAdd: () => void;
  onRemove: (localId: number) => void;
  onChange: (localId: number, key: "idServ" | "monto", value: string) => void;
  onSave: () => void;
};

function ServiciosEditor({ servicios, catalogo, saving, saved, error, onAdd, onRemove, onChange, onSave }: Props) {
  return (
    <div>
      {saved && <p className="mb-4 text-sm font-medium text-green-700">✓ Cambios guardados correctamente.</p>}
      {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}

      <div className="grid grid-cols-[1fr_140px_auto] items-end gap-3 text-xs font-medium text-gray-500">
        <span>Servicio</span>
        <span>Monto</span>
        <span />
      </div>

      <div className="mt-2 space-y-3">
        {servicios.map((row) => (
          <div key={row.localId} className="grid grid-cols-[1fr_140px_auto] items-center gap-3">
            <select
              value={row.idServ}
              onChange={(e) => onChange(row.localId, "idServ", e.target.value)}
              className="rounded-md border-2 border-gray-200 p-2.5"
            >
              <option value="">Seleccionar servicio</option>
              {catalogo.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 rounded-md border-2 border-gray-200 p-2.5">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                min={0}
                value={row.monto}
                onChange={(e) => onChange(row.localId, "monto", e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => onRemove(row.localId)}
              aria-label="Quitar servicio"
              className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-4 w-full rounded-lg border-2 border-dashed border-gray-300 py-2 text-sm font-medium text-gray-600 hover:border-sky-300 hover:text-sky-800"
      >
        + Agregar servicio
      </button>

      <p className="mt-2 text-xs text-gray-500">Servicios asociados a tu perfil y su monto.</p>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-lg bg-sky-800 px-5 py-2.5 font-semibold text-white hover:bg-sky-900 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

export default ServiciosEditor;

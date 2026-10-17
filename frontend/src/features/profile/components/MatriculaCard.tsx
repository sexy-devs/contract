import { useState, type ChangeEvent } from "react";
import type { Matricula } from "../../providers/api/providerProfileApi";

type Props = {
  matricula: Matricula | null;
  uploading?: boolean;
  error?: string | null;
  onUpload: (file: File) => void;
};

const ESTADO_STYLES: Record<string, string> = {
  pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  aprobada: "bg-green-50 text-green-700 border-green-200",
  rechazada: "bg-red-50 text-red-700 border-red-200",
};

const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

function MatriculaCard({ matricula, uploading, error, onUpload }: Props) {
  const [showPreview, setShowPreview] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  }

  const isRejected = matricula?.estado === "rechazada";
  const isImage = !!matricula && /\.(png|jpe?g|gif|webp)$/i.test(matricula.fotoUrl);
  const fileName = matricula?.fotoUrl.split("/").pop() ?? "";

  const uploadButton = (
    <label className="inline-block cursor-pointer rounded-lg border-2 border-sky-800 bg-sky-800 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-900">
      {uploading ? "Subiendo..." : matricula ? (isRejected ? "Volver a subir matrícula" : "Reemplazar documento") : "Subir matrícula"}
      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleChange} disabled={uploading} />
    </label>
  );

  if (!matricula) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="font-semibold text-gray-900">No tenés una matrícula cargada</p>
        <p className="mt-1 text-sm text-gray-600">Subí una foto o archivo de tu matrícula para que pueda ser revisada.</p>
        <div className="mt-4">{uploadButton}</div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 p-5">
      {isRejected && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Documentación rechazada. Tenés que volver a cargar tu matrícula para que pueda ser revisada nuevamente.
        </p>
      )}

      <p className="text-sm font-semibold text-gray-900">Documento cargado</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="truncate text-sm text-gray-700">{fileName}</span>
        <button type="button" onClick={() => setShowPreview((v) => !v)} className="text-sm font-medium text-sky-800 hover:underline">
          {showPreview ? "Ocultar documento" : "Ver documento"}
        </button>
        <a
          href={matricula.fotoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-sky-800 hover:underline"
        >
          Abrir en una pestaña nueva
        </a>
      </div>

      {showPreview && isImage && (
        <img src={matricula.fotoUrl} alt="Vista previa de la matrícula" className="mt-3 max-h-64 rounded-lg border border-gray-200" />
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-gray-500">Estado</p>
          <span
            className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              ESTADO_STYLES[matricula.estado] ?? ""
            }`}
          >
            {ESTADO_LABELS[matricula.estado] ?? matricula.estado}
          </span>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Fecha de expiración</p>
          <p className="mt-1 text-sm text-gray-900">{isRejected ? "—" : (matricula.fechaExpiracion ?? "—")}</p>
        </div>
      </div>

      <div className="mt-5">{uploadButton}</div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default MatriculaCard;

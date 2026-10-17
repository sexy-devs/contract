import { useState, type DragEvent } from "react";
import {
  acceptedDocumentationTypes,
  documentationMaxBytes,
} from "../registrationValidation";

type Props = {
  file: File | null;
  validationError: string;
  onChange: (file: File | null) => void;
};

function DocumentationStep({ file, validationError, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  function selectFile(selectedFile: File | undefined) {
    if (!selectedFile) return;

    if (!acceptedDocumentationTypes.includes(selectedFile.type)) {
      setFileError("Seleccioná un archivo PDF, JPG o PNG.");
      return;
    }

    if (selectedFile.size > documentationMaxBytes) {
      setFileError("El archivo no puede superar los 10 MB.");
      return;
    }

    setFileError("");
    onChange(selectedFile);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }

  function removeFile() {
    setFileError("");
    onChange(null);
  }

  const displayedError = fileError || validationError;

  return (
    <section aria-labelledby="documentation-title">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-sky-800">
          05
        </span>
        <h2
          id="documentation-title"
          className="text-lg font-bold text-gray-900"
        >
          Documentación
        </h2>
      </div>

      <div className="mt-5">
        <p className="font-semibold text-gray-900">
          Matrícula o certificación{" "}
          <span className="font-normal text-gray-500">
            (cuando corresponda)
          </span>
        </p>

        <label
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className={`mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-5 py-6 text-center transition-colors ${
            isDragging
              ? "border-sky-800 bg-blue-50"
              : "border-sky-300 bg-white hover:bg-blue-50"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={(event) => selectFile(event.target.files?.[0])}
            className="sr-only"
          />

          {file ? (
            <>
              <span className="font-semibold text-gray-900">{file.name}</span>
              <span className="mt-1 text-sm text-gray-500">
                Seleccioná otro archivo para reemplazarlo
              </span>
            </>
          ) : (
            <>
              <span className="text-gray-600">
                Arrastrá o seleccioná el archivo de matrícula o certificación
              </span>
              <span className="mt-4 rounded-lg border border-sky-300 bg-white px-4 py-2 font-semibold text-sky-800">
                Seleccionar archivo
              </span>
            </>
          )}
        </label>

        {file && (
          <button
            type="button"
            onClick={removeFile}
            className="mt-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800"
          >
            Quitar archivo
          </button>
        )}

        {displayedError && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {displayedError}
          </p>
        )}
      </div>
    </section>
  );
}

export default DocumentationStep;

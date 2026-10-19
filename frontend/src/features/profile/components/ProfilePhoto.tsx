import type { ChangeEvent } from "react";

type Props = {
  fotoUrl: string | null;
  initials: string;
  description: string;
  uploading?: boolean;
  onSelectFile: (file: File) => void;
};

function ProfilePhoto({ fotoUrl, initials, description, uploading, onSelectFile }: Props) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelectFile(file);
    e.target.value = "";
  }

  return (
    <div className="flex items-center gap-6">
      <div
        className="flex size-20 shrink-0 items-center justify-center rounded-full bg-blue-50 bg-cover bg-center text-2xl font-semibold text-sky-800"
        style={fotoUrl ? { backgroundImage: `url(${fotoUrl})` } : undefined}
      >
        {!fotoUrl && initials}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">Foto de perfil</p>
        <p className="text-xs text-gray-600">{description}</p>
        <label className="mt-2 inline-block cursor-pointer rounded-lg border-2 border-gray-200 px-3 py-1.5 text-sm font-medium text-sky-800 hover:border-sky-300">
          {uploading ? "Subiendo..." : "Cambiar foto"}
          <input type="file" accept="image/*" className="hidden" onChange={handleChange} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

export default ProfilePhoto;

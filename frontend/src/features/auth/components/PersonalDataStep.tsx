export type PersonalData = {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  telefono: string;
  fotoPerfil: File | null;
};

type TextField = Exclude<keyof PersonalData, "fotoPerfil">;

type Props = {
  data: PersonalData;
  errors: Partial<Record<keyof PersonalData, string>>;
  onChange: (field: TextField, value: string) => void;
  onPhotoChange: (file: File | null) => void;
};

const inputClass =
  "w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-sky-800";

function PersonalDataStep({ data, errors, onChange, onPhotoChange }: Props) {
  return (
    <section aria-labelledby="personal-data-title">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-sky-800">
          01
        </span>
        <h2 id="personal-data-title" className="text-lg font-bold text-gray-900">
          Datos personales
        </h2>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="font-semibold text-gray-900">
          Nombre <span className="text-red-600">*</span>
          <input
            type="text"
            value={data.nombre}
            onChange={(event) => onChange("nombre", event.target.value)}
            placeholder="Ej.: María"
            autoComplete="given-name"
            maxLength={100}
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={errors.nombre ? "nombre-error" : undefined}
            className={`${inputClass} mt-1.5 font-normal ${errors.nombre ? "border-red-500" : ""}`}
          />
          {errors.nombre && (
            <span id="nombre-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.nombre}
            </span>
          )}
        </label>

        <label className="font-semibold text-gray-900">
          Apellido <span className="text-red-600">*</span>
          <input
            type="text"
            value={data.apellido}
            onChange={(event) => onChange("apellido", event.target.value)}
            placeholder="Ej.: González"
            autoComplete="family-name"
            maxLength={100}
            aria-invalid={Boolean(errors.apellido)}
            aria-describedby={errors.apellido ? "apellido-error" : undefined}
            className={`${inputClass} mt-1.5 font-normal ${errors.apellido ? "border-red-500" : ""}`}
          />
          {errors.apellido && (
            <span id="apellido-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.apellido}
            </span>
          )}
        </label>

        <label className="font-semibold text-gray-900 md:col-span-2">
          Email <span className="text-red-600">*</span>
          <input
            type="text"
            inputMode="email"
            value={data.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="nombre@correo.com"
            autoComplete="email"
            maxLength={50}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${inputClass} mt-1.5 font-normal ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <span id="email-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.email}
            </span>
          )}
        </label>

        <label className="font-semibold text-gray-900">
          Contraseña <span className="text-red-600">*</span>
          <input
            type="password"
            value={data.contrasena}
            onChange={(event) => onChange("contrasena", event.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            maxLength={72}
            aria-invalid={Boolean(errors.contrasena)}
            aria-describedby={errors.contrasena ? "password-error" : undefined}
            className={`${inputClass} mt-1.5 font-normal ${errors.contrasena ? "border-red-500" : ""}`}
          />
          {errors.contrasena && (
            <span id="password-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.contrasena}
            </span>
          )}
        </label>

        <label className="font-semibold text-gray-900">
          Teléfono <span className="text-red-600">*</span>
          <input
            type="tel"
            value={data.telefono}
            onChange={(event) => onChange("telefono", event.target.value)}
            placeholder="+54 11 5555 0000"
            autoComplete="tel"
            maxLength={30}
            aria-invalid={Boolean(errors.telefono)}
            aria-describedby={errors.telefono ? "phone-error" : undefined}
            className={`${inputClass} mt-1.5 font-normal ${errors.telefono ? "border-red-500" : ""}`}
          />
          {errors.telefono && (
            <span id="phone-error" className="mt-1 block text-sm font-normal text-red-600">
              {errors.telefono}
            </span>
          )}
        </label>
      </div>

      <div className="mt-4">
        <p className="font-semibold text-gray-900">Foto de perfil</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full border border-dashed border-sky-300 bg-blue-50 text-xs text-sky-800">
            Foto
          </div>

          <label
            htmlFor="profile-photo"
            className="cursor-pointer rounded-lg border border-sky-200 bg-blue-50 px-4 py-2 font-semibold text-sky-800 hover:bg-blue-100 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-800"
          >
            Subir foto
            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={(event) => onPhotoChange(event.target.files?.[0] ?? null)}
              className="sr-only"
            />
          </label>

          <span className="text-sm text-gray-600">
            {data.fotoPerfil?.name ?? "Ningún archivo seleccionado"}
          </span>
        </div>
        {errors.fotoPerfil && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.fotoPerfil}
          </p>
        )}
      </div>
    </section>
  );
}

export default PersonalDataStep;

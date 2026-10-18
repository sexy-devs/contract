import { useEffect, useState } from "react";
import { CheckmarkSVG, StarSVG } from "../../../assets/svg/svgs";
import { ApiError } from "../../../lib/api";
import { getProviderPublicProfile, type ProviderPublicProfile } from "../api/catalogApi";

type Props = {
  providerId: number;
  onClose: () => void;
};

function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const days = Math.max(0, Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)));

  if (days < 1) return "Hoy";
  if (days < 7) return `Hace ${days} día${days === 1 ? "" : "s"}`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return `Hace ${weeks} semana${weeks === 1 ? "" : "s"}`;
  }
  const months = Math.round(days / 30);
  return `Hace ${months} mes${months === 1 ? "" : "es"}`;
}

function ProviderDetailPanel({ providerId, onClose }: Props) {
  const [profile, setProfile] = useState<ProviderPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProviderPublicProfile(providerId)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "No se pudo cargar la ficha.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [providerId]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const initials = profile ? `${profile.nombre?.[0] ?? ""}${profile.apellido?.[0] ?? ""}`.toUpperCase() : "";
  const oficio = profile?.servicios.map((s) => s.nombre).join(", ") || null;
  const disponible = !!profile?.disponibilidad;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-center justify-between">
          <button type="button" onClick={onClose} className="text-sm font-medium text-sky-800 hover:underline">
            ← Volver a resultados
          </button>
          <span className="text-xs font-semibold tracking-wide text-gray-400">FICHA PÚBLICA</span>
        </div>

        {loading && <p className="mt-10 text-center text-gray-600">Cargando...</p>}
        {error && <p className="mt-10 text-center text-red-600">{error}</p>}

        {profile && !loading && !error && (
          <div className="mt-6">
            <div className="flex flex-col items-center text-center">
              <div
                className="flex size-20 items-center justify-center rounded-full bg-blue-50 bg-cover bg-center text-xl font-semibold text-sky-800"
                style={profile.fotoUrl ? { backgroundImage: `url(${profile.fotoUrl})` } : undefined}
              >
                {!profile.fotoUrl && initials}
              </div>
              <h2 className="mt-3 text-2xl font-bold text-gray-900">
                {profile.nombre} {profile.apellido}
              </h2>
              {oficio && <p className="font-medium text-sky-800">{oficio}</p>}
              {profile.zona && <p className="text-sm text-gray-500">{profile.zona}, Buenos Aires</p>}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 p-1.5">
                <StarSVG className="size-5 text-yellow-400" fill="currentColor" />
                <p className="text-sm font-bold">
                  {profile.calificacionGlobal.toFixed(1)}{" "}
                  <span className="font-normal text-gray-400">({profile.cantidadCalificaciones})</span>
                </p>
              </div>

              {profile.verificado && (
                <div className="flex items-center gap-2 rounded-full border border-blue-400 bg-blue-200 p-1.5">
                  <CheckmarkSVG className="size-5 text-sky-800" />
                  <p className="text-sm font-bold text-sky-800">Verificado</p>
                </div>
              )}

              {disponible ? (
                <div className="flex items-center gap-2 rounded-full border border-green-400 bg-green-200 p-1.5">
                  <span className="size-2.5 rounded-full bg-green-800" />
                  <p className="text-sm font-bold text-green-800">Disponible</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-full border border-gray-400 bg-gray-200 p-1.5">
                  <span className="size-2.5 rounded-full bg-gray-800" />
                  <p className="text-sm font-bold text-gray-800">Sin disponibilidad</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200 p-4">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm ${
                  profile.verificado ? "bg-blue-50 text-sky-800" : "bg-gray-100 text-gray-500"
                }`}
              >
                {profile.verificado ? "✓" : "–"}
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  Estado de verificación: {profile.verificado ? "Verificado" : "Sin verificar"}
                </p>
                <p className="text-sm text-gray-600">
                  {profile.verificado ? "Matrícula profesional aprobada." : "Todavía no cuenta con matrícula aprobada."}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-900">Información profesional</p>
              {profile.descripcion && <p className="mt-2 text-sm text-gray-600">{profile.descripcion}</p>}

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Experiencia</p>
                  <p className="text-sm text-gray-900">{profile.aniosExperiencia} años</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Radio de cobertura</p>
                  <p className="text-sm text-gray-900">{profile.aceptaRadioKm} km</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500">Disponibilidad</p>
              <p className="mt-1 text-sm text-gray-900">{profile.disponibilidad ?? "Sin información"}</p>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">Trabajos realizados</p>
                <span className="text-sm text-gray-500">{profile.trabajosFinalizados} en total</span>
              </div>
              {profile.trabajos.length > 0 ? (
                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {profile.trabajos.map((trabajo, index) => (
                    <div key={index}>
                      <div
                        className="aspect-square rounded-lg border border-dashed border-sky-200"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, #eff6ff, #eff6ff 6px, #ffffff 6px, #ffffff 12px)",
                        }}
                      />
                      <p className="mt-1 text-xs text-gray-500">{formatRelativeDate(trabajo.fecha)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">Todavía no registra trabajos finalizados.</p>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">Reseñas</p>
                {profile.cantidadCalificaciones > 0 && (
                  <span className="text-sm text-gray-500">
                    ★ {profile.calificacionGlobal.toFixed(1)} · {profile.cantidadCalificaciones} reseñas
                  </span>
                )}
              </div>
              {profile.resenas.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {profile.resenas.map((resena, index) => (
                    <li key={index} className="border-t border-gray-100 pt-3 first:border-0 first:pt-0">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-sky-800">
                          {resena.autor
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        <p className="text-sm font-semibold text-gray-900">{resena.autor}</p>
                        <span className="text-xs text-yellow-500">{"★".repeat(resena.calificacion)}</span>
                      </div>
                      {resena.comentario && <p className="mt-1 text-sm text-gray-600">{resena.comentario}</p>}
                      <p className="mt-1 text-xs text-gray-400">{formatRelativeDate(resena.fecha)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-500">Todavía no tiene reseñas.</p>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default ProviderDetailPanel;

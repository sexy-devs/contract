import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ApiError } from "../../../lib/api";
import { deactivateUser } from "../api/adminUsersApi";

type Props = {
  userId: number;
  userName: string;
  disabled?: boolean;
  onDeactivated: (userId: number) => void;
};

function DeactivateUserButton({ userId, userName, disabled = false, onDeactivated }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!confirmOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [confirmOpen]);

  useEffect(() => {
    if (!confirmOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        setConfirmOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmOpen, submitting]);

  function openConfirmation() {
    setError(null);
    setConfirmOpen(true);
  }

  function closeConfirmation() {
    if (!submitting) setConfirmOpen(false);
  }

  async function handleDeactivate() {
    setSubmitting(true);
    setError(null);

    try {
      const user = await deactivateUser(userId);
      setConfirmOpen(false);
      onDeactivated(user.id);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "No se pudo dar de baja al usuario.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={openConfirmation}
        disabled={disabled || submitting}
        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Dar de baja a ${userName}`}
      >
        Dar de baja
      </button>

      {confirmOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] overflow-y-auto p-4"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-sm"
              onClick={closeConfirmation}
              aria-label="Cerrar confirmación"
              tabIndex={-1}
            />

            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={`deactivate-title-${userId}`}
              aria-describedby={`deactivate-description-${userId}`}
              className="relative overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl"
              style={{
                width: "min(360px, calc(100vw - 32px))",
                maxWidth: "360px",
                height: "auto",
                maxHeight: "calc(100dvh - 32px)",
                flex: "0 0 auto",
              }}
            >
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                      <path
                        d="M12 8v4m0 4h.01M10.3 3.7 2.8 17a2 2 0 0 0 1.74 3h14.92a2 2 0 0 0 1.74-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 id={`deactivate-title-${userId}`} className="text-lg font-bold text-gray-900">
                      Dar de baja al usuario
                    </h2>
                    <p id={`deactivate-description-${userId}`} className="mt-1 text-sm leading-5 text-gray-600">
                      Vas a desactivar la cuenta de{" "}
                      <strong className="font-semibold text-gray-900">{userName}</strong>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeConfirmation}
                    disabled={submitting}
                    className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    aria-label="Cerrar"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm font-semibold text-amber-900">La cuenta perderá el acceso</p>
                  <p className="mt-1 text-sm leading-5 text-amber-800">
                    No podrá iniciar sesión, pero sus datos y registros se conservarán.
                  </p>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
                  >
                    {error}
                  </p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <button
                    ref={cancelButtonRef}
                    type="button"
                    onClick={closeConfirmation}
                    disabled={submitting}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDeactivate}
                    disabled={submitting}
                    className="w-full rounded-xl bg-red-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                    style={{
                      display: "block",
                      width: "100%",
                      backgroundColor: "#dc2626",
                      color: "#ffffff",
                      border: "1px solid #dc2626",
                    }}
                  >
                    {submitting ? "Dando de baja..." : "Sí, dar de baja"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default DeactivateUserButton;

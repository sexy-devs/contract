import { useState } from "react";

import { ApiError } from "../../../lib/api";
import { deactivateUser } from "../api/adminUsersApi";

type Props = {
  userId: number;
  userName: string;
  disabled?: boolean;
  onDeactivated: (userId: number) => void;
};

function DeactivateUserButton({ userId, userName, disabled = false, onDeactivated }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDeactivate() {
    const confirmed = window.confirm(
      `¿Confirmás la baja de ${userName}? La cuenta perderá el acceso, pero sus registros se conservarán.`,
    );

    if (!confirmed) return;

    setSubmitting(true);
    setError(null);

    try {
      const user = await deactivateUser(userId);
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
        onClick={handleDeactivate}
        disabled={disabled || submitting}
        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Dar de baja a ${userName}`}
      >
        {submitting ? "Dando de baja..." : "Dar de baja"}
      </button>

      {error && (
        <p role="alert" className="max-w-64 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default DeactivateUserButton;

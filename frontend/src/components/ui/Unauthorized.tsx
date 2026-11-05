import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const duration = 5000;

function Unauthorized() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();

    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));

      if (elapsed >= duration) {
        clearInterval(tick);
        navigate("/iniciar-sesion", { replace: true });
      }
    }, 30);

    return () => clearInterval(tick);
  }, [navigate]);

  return (
    <div
      id="navigation-error-message"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-blue-50 px-6 text-center"
    >
      <h1 className="text-[56px] font-bold text-sky-800">401</h1>
      <div className="w-full max-w-xs">
        <p className="mb-1 text-sm text-gray-500">Redirigiendo...</p>
        <div className="h-1 overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full bg-sky-800"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <button
        onClick={() => navigate("/iniciar-sesion")}
        className="rounded-lg bg-sky-800 px-4 py-2 font-semibold text-white hover:bg-sky-900"
      >
        Iniciar sesión
      </button>
    </div>
  );
}

export default Unauthorized;

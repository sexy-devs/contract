import { useState, type SubmitEvent } from "react";
import type { LoginPayload } from "../api/authApi";

type Props = {
  onSubmit: (payload: LoginPayload) => void;
  loading?: boolean;
  error?: string | null;
};

function LoginForm({ onSubmit, loading, error }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "Escriba su email";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Ingresa un email válido";

    if (!password) newErrors.password = "Escriba su contraseña";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ email, password });
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl text-center font-carlito">C logo Contract</h2>
      <div className="login-form bg-white w-140 mx-auto p-10 rounded-lg font-carlito shadow-md">
        <h2 className="text-3xl">Iniciar Sesión</h2>
        <p className="text-gray-600">Ingresá con tu email y contraseña</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1 mt-5">
            <label htmlFor="email" className="flex items-center gap-1">
              Email{" "}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              className={`border-2 rounded-md p-2.5 ${errors.email ? "border-red-500" : "border-gray-200"}`}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600">{errors.email}</p>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="flex items-center gap-1">
              Contraseña{" "}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <div className={`border-2 rounded-md p-2.5 ${errors.password ? "border-red-500" : "border-gray-200"} flex justify-between items-center h-13`}>
              <input
                id="password"
                type={hiddenPassword ? "password" : "text"}
                value={password}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              <button
                type="button"
                onClick={() => setHiddenPassword(!hiddenPassword)}
                className="bg-blue-50 text-sky-800 p-2 rounded-lg"
              >
                {hiddenPassword ? "Mostrar" : "Ocultar"}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {error && <p>{error}</p>}
          <button
            type="submit"
            className="bg-sky-800 text-white rounded-lg h-9"
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <hr className="mt-5 mb-5 border-gray-200" />

        <p className="text-center">
          ¿No tienes cuenta?{" "}
          <span className="text-sky-800" aria-hidden="true">
            <a href="#" className="no-underline">Registrate</a>
          </span>
        </p>
      </div>
    </div>
  );
}
export default LoginForm;

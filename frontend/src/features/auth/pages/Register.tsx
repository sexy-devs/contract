import { useState } from "react";
import { Link } from "react-router-dom";
import AccountTypeSelector, {
  type AccountType,
} from "../components/AccountTypeSelector";
import RegistrationProgress from "../components/RegistrationProgress";
import LogoContract from "../../../components/layout/LogoContract";

function Register() {
  const [accountType, setAccountType] = useState<AccountType>("cliente");

  function handleContinue() {
    console.log("Continuar registro como:", accountType);
  }

  return (
    <main className="min-h-screen bg-indigo-50 font-carlito lg:grid lg:grid-cols-[35%_65%]">
      <aside className="bg-blue-50 px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
        <LogoContract />
        <div className="mt-10 max-w-sm lg:mt-14">
          <h2 className="text-3xl font-bold leading-tight text-gray-900">
            Conectamos clientes con profesionales de mantenimiento.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Creá tu cuenta para comenzar a usar la plataforma.
          </p>
        </div>

        <div className="mt-12 hidden h-44 max-w-sm items-center justify-center rounded-xl border border-dashed border-sky-300 bg-white/30 text-sm text-sky-700 sm:flex">
          Ilustración / imagen de marca
        </div>
      </aside>

      <section className="flex items-start justify-center px-4 py-8 sm:px-8 lg:py-12">
        <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8">
          <header>
            <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
            <p className="mt-1 text-gray-600">
              Los campos marcados con <span className="text-red-600">*</span> son obligatorios.
            </p>
          </header>

          <div className="mt-7">
            <RegistrationProgress accountType={accountType} currentStep={1} />
          </div>

          <div className="mt-7">
            <AccountTypeSelector value={accountType} onChange={setAccountType} />
          </div>

          <div className="mt-6 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full rounded-lg bg-sky-800 px-4 py-3 font-semibold text-white hover:bg-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800"
            >
              Continuar
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              ¿Ya tenés una cuenta?{" "}
              <Link to="/iniciar-sesion" className="font-medium text-sky-800 hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;

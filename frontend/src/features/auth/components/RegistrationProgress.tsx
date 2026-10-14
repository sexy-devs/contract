import type { AccountType } from "./AccountTypeSelector";

type Props = {
  accountType: AccountType;
  currentStep: number;
};

const stepsByAccountType: Record<AccountType, string[]> = {
  cliente: ["Tipo de cuenta", "Datos personales", "Ubicación"],
  profesional: [
    "Tipo de cuenta",
    "Datos personales",
    "Información profesional",
    "Cobertura y disponibilidad",
    "Servicios",
    "Documentación",
  ],
};

function RegistrationProgress({ accountType, currentStep }: Props) {
  const steps = stepsByAccountType[accountType];
  const nextStep = steps[currentStep];

  return (
    <nav aria-label="Progreso del registro">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p className="font-semibold text-sky-800">
          Paso {currentStep} de {steps.length}
        </p>
        {nextStep && <p className="text-gray-600">Siguiente: {nextStep}</p>}
      </div>

      <ol
        className="mt-2 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompletedOrActive = stepNumber <= currentStep;

          return (
            <li
              key={step}
              aria-current={stepNumber === currentStep ? "step" : undefined}
              className="min-w-0"
            >
              <div
                className={`h-1 rounded-full ${
                  isCompletedOrActive ? "bg-sky-800" : "bg-gray-200"
                }`}
              />
              <span
                className={`mt-1 block truncate text-xs ${
                  stepNumber === currentStep
                    ? "font-semibold text-gray-900"
                    : "text-gray-500"
                }`}
                title={step}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default RegistrationProgress;

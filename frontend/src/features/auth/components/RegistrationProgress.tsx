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
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          const progressClass = isCompleted
            ? "bg-sky-800"
            : isActive
              ? "bg-sky-800/40"
              : "bg-gray-200";

          const labelClass = isCompleted
            ? "font-medium text-sky-800"
            : isActive
              ? "font-semibold text-gray-900"
              : "text-gray-500";

          return (
            <li
              key={step}
              aria-current={isActive ? "step" : undefined}
              className="min-w-0"
            >
              <div className={`h-1 rounded-full ${progressClass}`} />
              <span
                className={`mt-1 block truncate text-xs ${labelClass}`}
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

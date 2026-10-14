export type AccountType = "cliente" | "profesional";

type Props = {
  value: AccountType;
  onChange: (accountType: AccountType) => void;
};

function AccountTypeSelector({ value, onChange }: Props) {
  const optionClass = (accountType: AccountType) =>
    `flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-800 ${
      value === accountType
        ? "border-gray-900 bg-blue-50"
        : "border-gray-200 bg-white hover:border-sky-300"
    }`;

  return (
    <fieldset>
      <legend className="font-semibold text-gray-900">
        ¿Cómo vas a utilizar Contract? <span className="text-red-600">*</span>
      </legend>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className={optionClass("cliente")}>
          <input
            type="radio"
            name="accountType"
            value="cliente"
            checked={value === "cliente"}
            onChange={() => onChange("cliente")}
            className="mt-1 size-5 shrink-0 accent-sky-800"
          />
          <span>
            <span className="block font-semibold text-gray-900">Cliente</span>
            <span className="mt-1 block text-sm text-gray-600">
              Contratar servicios de mantenimiento
            </span>
          </span>
        </label>

        <label className={optionClass("profesional")}>
          <input
            type="radio"
            name="accountType"
            value="profesional"
            checked={value === "profesional"}
            onChange={() => onChange("profesional")}
            className="mt-1 size-5 shrink-0 accent-sky-800"
          />
          <span>
            <span className="block font-semibold text-gray-900">Profesional</span>
            <span className="mt-1 block text-sm text-gray-600">
              Ofrecer servicios de mantenimiento
            </span>
          </span>
        </label>
      </div>
    </fieldset>
  );
}

export default AccountTypeSelector;

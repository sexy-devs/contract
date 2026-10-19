type SelectOption = { value: string | number; label: string };

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select";
  placeholder?: string;
  suffix?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  options?: SelectOption[];
};

function ProfileField({
  id,
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  suffix,
  hint,
  error,
  disabled,
  className,
  options,
}: Props) {
  const inputClass = `w-full rounded-lg border p-2.5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
    error ? "border-red-500" : "border-gray-200"
  }`;

  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-gray-900">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      <div className="mt-1 flex items-center gap-2">
        {type === "textarea" ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={3}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={inputClass}
          />
        ) : type === "select" ? (
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={inputClass}
          >
            <option value="">{placeholder ?? "Seleccionar"}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={inputClass}
          />
        )}
        {suffix && <span className="shrink-0 text-sm text-gray-600">{suffix}</span>}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default ProfileField;

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  colSpan?: string;
}

export function FormField({ id, name, label, type = "text", required = false, placeholder, error, className = "", colSpan = "col-span-full", defaultValue }: FormFieldProps) {
  return (
    <div className={colSpan}>
      <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          value={defaultValue}
          className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${className}`}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
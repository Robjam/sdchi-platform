
interface TextareaFieldProps {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  rows?: number;
  colSpan?: string;
  description?: string;
}

export function TextareaField({ id, name, label, required = false, placeholder, error, rows = 3, colSpan = "col-span-full", description, defaultValue }: TextareaFieldProps) {
  return (
    <div className={colSpan}>
      <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-2">
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        >
          {defaultValue}
        </textarea>
      </div>
      {description && (
        <p className="mt-3 text-sm/6 text-gray-600">{description}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
import type { FC, SelectHTMLAttributes } from "react";
import { cn } from "../lib/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select: FC<SelectProps> = (props) => {
  const { label, options, error, className, id, ...rest } = props;
  const selectClass = cn(
    "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors px-3 py-2",
    error &&
      "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500",
    className,
  );
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <select id={id} className={selectClass} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

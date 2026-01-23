import type { FC } from "react";
import { cn } from "../lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: FC<InputProps> = (props) => {
  const { label, error, className, id, ...rest } = props;
  const inputClass = cn(
    "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors px-3 py-2",
    error &&
      "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500",
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
      <input id={id} className={inputClass} {...rest} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

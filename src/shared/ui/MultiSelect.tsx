import type { FC } from "react";
import { cn } from "../lib/cn";
import { Chip } from "./Chip";

interface MultiSelectOption {
  id: number;
  name: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selectedIds: number[];
  onChange: (selectedIds: number[]) => void;
  error?: string;
  placeholder?: string;
}

export const MultiSelect: FC<MultiSelectProps> = (props) => {
  const {
    label,
    options,
    selectedIds,
    onChange,
    error,
    placeholder = "Select options...",
  } = props;

  const handleToggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedOptions = options.filter((option) =>
    selectedIds.includes(option.id),
  );
  const unselectedOptions = options.filter(
    (option) => !selectedIds.includes(option.id),
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map((option) => (
            <Chip
              key={option.id}
              label={option.name}
              onRemove={() => handleToggle(option.id)}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <select
          className={cn(
            "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors px-3 py-2",
            error &&
              "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500",
          )}
          value=""
          onChange={(e) => {
            const id = Number(e.target.value);
            if (id) handleToggle(id);
          }}
        >
          <option value="">{placeholder}</option>
          {unselectedOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

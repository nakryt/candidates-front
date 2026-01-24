import type { FC } from "react";
import { cn } from "../lib/cn";
import { X } from "./icons";

interface ChipProps {
  label: string;
  className?: string;
  onRemove?: () => void;
}

export const Chip: FC<ChipProps> = (props) => {
  const { label, className, onRemove } = props;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100",
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

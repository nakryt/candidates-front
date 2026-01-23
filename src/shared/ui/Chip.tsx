import type { FC } from "react";
import { cn } from "../lib/cn";

interface ChipProps {
  label: string;
  className?: string;
}

export const Chip: FC<ChipProps> = (props) => {
  const { label, className } = props;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100",
        className,
      )}
    >
      {label}
    </span>
  );
};

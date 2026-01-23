import type { FC } from "react";
import {
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "../../../shared/constants/status";
import { cn } from "../../../shared/lib/cn";
import type { CandidateStatus } from "../../../shared/types/candidate";

interface StatusFilterProps {
  value: CandidateStatus | "all";
  onChange: (value: CandidateStatus | "all") => void;
}

export const StatusFilter: FC<StatusFilterProps> = (props) => {
  const { value, onChange } = props;
  const options = ["all", ...STATUS_OPTIONS] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const label =
          option === "all"
            ? "All Candidates"
            : STATUS_LABELS[option as CandidateStatus];
        const ariaLabel = `Filter by ${option === "all" ? "all candidates" : label.toLowerCase()}`;
        const btnClass = cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
          value === option
            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
        );

        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            aria-label={ariaLabel}
            aria-pressed={value === option}
            className={btnClass}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

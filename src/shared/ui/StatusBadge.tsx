import type { FC } from "react";
import { STATUS_COLORS, STATUS_LABELS } from "../constants/status";
import { cn } from "../lib/cn";
import type { CandidateStatus } from "../types/candidate";

interface StatusBadgeProps {
  status: CandidateStatus;
  className?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = (props) => {
  const { status, className } = props;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        STATUS_COLORS[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
};

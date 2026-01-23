import type { CandidateStatus } from "../types/candidate";

export const STATUS_OPTIONS: CandidateStatus[] = [
  "active",
  "interview",
  "rejected",
];

export const STATUS_LABELS: Record<CandidateStatus, string> = {
  active: "Active",
  interview: "Interview",
  rejected: "Rejected",
};

export const STATUS_COLORS: Record<CandidateStatus, string> = {
  active: "bg-green-100 text-green-800",
  interview: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

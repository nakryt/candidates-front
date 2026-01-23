import { useState } from "react";
import { useDebounce } from "../../../shared/lib/useDebounce";
import type { CandidateStatus } from "../../../shared/types/candidate";

export const useFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">(
    "all",
  );

  // Debounce search query to avoid excessive filtering while typing
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  return {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  };
};

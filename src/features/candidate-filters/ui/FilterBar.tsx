import type { FC } from "react";
import type { CandidateStatus } from "../../../shared/types/candidate";
import { SearchInput } from "./SearchInput";
import { StatusFilter } from "./StatusFilter";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: CandidateStatus | "all";
  onStatusChange: (value: CandidateStatus | "all") => void;
}

export const FilterBar: FC<FilterBarProps> = (props) => {
  const { searchQuery, onSearchChange, statusFilter, onStatusChange } = props;
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <SearchInput value={searchQuery} onChange={onSearchChange} />
      <StatusFilter value={statusFilter} onChange={onStatusChange} />
    </div>
  );
};

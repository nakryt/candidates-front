import type { Candidate, CandidateStatus } from "../types/candidate";

export function filterCandidates(
  candidates: Candidate[],
  searchQuery: string,
  statusFilter: CandidateStatus | "all",
): Candidate[] {
  return candidates.filter((candidate) => {
    // Check if candidate name matches search query
    const matchesSearch = candidate.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Check if candidate status matches filter
    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}

import { useCallback, useEffect, useOptimistic, useState } from "react";
import { candidateApi } from "../../../shared/api/candidateApi";
import { isApiError } from "../../../shared/api/types";
import type { Candidate, CandidateStatus } from "./types";

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    if (error.statusCode === 0) {
      return "Unable to connect to the server. Please check your internet connection.";
    }

    // Rate limiting
    if (error.statusCode === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    // Server errors
    if (error.statusCode >= 500) {
      return "Server error occurred. Please try again later.";
    }

    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

type OptimisticAction = {
  type: "update_status";
  id: number;
  status: CandidateStatus;
};

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useOptimistic hook for optimistic updates
  const [optimisticCandidates, updateOptimisticCandidates] = useOptimistic(
    candidates,
    (state: Candidate[], action: OptimisticAction) => {
      if (action.type === "update_status") {
        return state.map((c) =>
          c.id === action.id
            ? {
                ...c,
                status: action.status,
                updatedAt: new Date().toISOString(),
              }
            : c,
        );
      }
      return state;
    },
  );

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await candidateApi.getAll(1, 100);
      setCandidates(response.data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Failed to fetch candidates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCandidateStatus = useCallback(
    async (id: number, status: CandidateStatus) => {
      const candidateToUpdate = candidates.find((c) => c.id === id);

      if (!candidateToUpdate) {
        throw new Error("Candidate not found");
      }

      updateOptimisticCandidates({ type: "update_status", id, status });

      try {
        const updated = await candidateApi.updateStatus(id, status);

        setCandidates((prev) => prev.map((c) => (c.id === id ? updated : c)));

        return updated;
      } catch (err) {
        console.error("Failed to update candidate status:", err);
        throw err;
      }
    },
    [candidates, updateOptimisticCandidates],
  );

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return {
    candidates: optimisticCandidates,
    loading,
    error,
    updateCandidateStatus,
    refetch: fetchCandidates,
  };
};

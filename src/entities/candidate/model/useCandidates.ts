import { useCallback, useEffect, useOptimistic, useState } from "react";
import {
  candidateApi,
  type CreateCandidatePayload,
} from "../../../shared/api/candidateApi";
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

type OptimisticAction =
  | {
      type: "update_status";
      id: number;
      status: CandidateStatus;
    }
  | {
      type: "add";
      candidate: Candidate;
    };

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      if (action.type === "add") {
        return [action.candidate, ...state];
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

  const createCandidate = useCallback(
    async (payload: CreateCandidatePayload) => {
      const optimisticCandidate: Candidate = {
        id: Date.now(),
        name: payload.name,
        position: payload.position,
        email: payload.email,
        phone: payload.phone,
        description: payload.description || "",
        status: payload.status || "active",
        skills: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      updateOptimisticCandidates({
        type: "add",
        candidate: optimisticCandidate,
      });

      try {
        const newCandidate = await candidateApi.create(payload);

        setCandidates((prev) => [newCandidate, ...prev]);

        return newCandidate;
      } catch (err) {
        console.error("Failed to create candidate:", err);
        throw err;
      }
    },
    [updateOptimisticCandidates],
  );

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return {
    candidates: optimisticCandidates,
    loading,
    error,
    updateCandidateStatus,
    createCandidate,
    refetch: fetchCandidates,
  };
};

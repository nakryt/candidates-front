import type { Candidate, CandidateDetail, CandidateStatus } from "../types/candidate";
import api from "./api";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCandidatePayload {
  name: string;
  position: string;
  email: string;
  phone: string;
  description?: string;
  status?: CandidateStatus;
  skillIds?: number[];
}

export const candidateApi = {
  getAll: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Candidate>> => {
    const response = await api.get<PaginatedResponse<Candidate>>(
      "/candidates",
      {
        params: { page, limit },
      },
    );
    return response.data;
  },

  getById: async (id: number): Promise<CandidateDetail> => {
    const response = await api.get<CandidateDetail>(`/candidates/${id}`);
    return response.data;
  },

  create: async (payload: CreateCandidatePayload): Promise<CandidateDetail> => {
    const response = await api.post<CandidateDetail>("/candidates", payload);
    return response.data;
  },

  updateStatus: async (
    id: number,
    status: CandidateStatus,
  ): Promise<CandidateDetail> => {
    const response = await api.patch<CandidateDetail>(`/candidates/${id}/status`, {
      status,
    });
    return response.data;
  },
};

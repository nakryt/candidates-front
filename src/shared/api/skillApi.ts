import type { Skill } from "../types/candidate";
import api from "./api";

export const skillApi = {
  getAll: async (): Promise<Skill[]> => {
    const response = await api.get<Skill[]>("/skills");
    return response.data || [];
  },
};

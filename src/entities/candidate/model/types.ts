export type CandidateStatus = "active" | "interview" | "rejected";

export interface Skill {
  id: number;
  name: string;
}

// List item type — no PII fields (backend omits them from list responses)
export interface Candidate {
  id: number;
  name: string;
  position: string;
  status: CandidateStatus;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

// Detail type includes PII — returned by getById
export interface CandidateDetail extends Candidate {
  email: string;
  phone: string;
  description: string;
}

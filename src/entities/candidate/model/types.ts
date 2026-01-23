export type CandidateStatus = "active" | "interview" | "rejected";

export interface Skill {
  id: number;
  name: string;
}

export interface Candidate {
  id: number;
  name: string;
  position: string;
  status: CandidateStatus;
  email: string;
  phone: string;
  description: string;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

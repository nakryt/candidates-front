import type { FC } from "react";
import type { Candidate } from "../model/types";
import { CandidateCard } from "./CandidateCard";

interface CandidateGridProps {
  candidates: Candidate[];
  onViewDetails: (candidate: Candidate) => void;
  onPreloadDetails?: () => void;
}

/**
 * CandidateGrid component - displays candidates in a responsive grid layout
 * Lazy-loaded to improve initial page load performance
 */
const CandidateGrid: FC<CandidateGridProps> = (props) => {
  const { candidates, onViewDetails, onPreloadDetails } = props;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onViewDetails={onViewDetails}
          onPreloadDetails={onPreloadDetails}
        />
      ))}
    </div>
  );
};

export default CandidateGrid;

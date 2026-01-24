import { memo, type FC } from "react";
import { Avatar } from "../../../shared/ui/Avatar";
import { Button } from "../../../shared/ui/Button";
import { StatusBadge } from "../../../shared/ui/StatusBadge";
import type { Candidate } from "../model/types";

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
  onPreloadDetails?: () => void;
}

const CandidateCardComponent: FC<CandidateCardProps> = (props) => {
  const { candidate, onViewDetails, onPreloadDetails } = props;

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow group"
      onMouseEnter={onPreloadDetails}
      onFocus={onPreloadDetails}
    >
      <div className="flex items-start justify-between mb-4">
        <Avatar name={candidate.name} size="md" />
        <StatusBadge status={candidate.status} />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {candidate.name}
        </h3>
        <p className="text-sm text-gray-500 font-medium">
          {candidate.position}
        </p>
      </div>

      <Button
        variant="secondary"
        className="w-full justify-center"
        onClick={() => onViewDetails(candidate)}
        aria-label={`View details for ${candidate.name}`}
      >
        View details
      </Button>
    </div>
  );
};

export const CandidateCard = memo(CandidateCardComponent);

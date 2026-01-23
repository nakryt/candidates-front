import type { FC } from "react";
import { CandidateCardSkeleton } from "./CandidateCardSkeleton";

interface CandidateGridSkeletonProps {
  count?: number;
}

/**
 * CandidateGridSkeleton - displays multiple card skeletons in grid layout
 * Matches the responsive grid layout of CandidateGrid component
 * Default shows 8 cards (2 rows on desktop) for optimal perceived performance
 */
export const CandidateGridSkeleton: FC<CandidateGridSkeletonProps> = ({
  count = 8,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CandidateCardSkeleton key={index} />
      ))}
    </div>
  );
};

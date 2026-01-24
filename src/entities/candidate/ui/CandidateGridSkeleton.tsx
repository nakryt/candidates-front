import type { FC } from "react";
import { CandidateCardSkeleton } from "./CandidateCardSkeleton";

interface CandidateGridSkeletonProps {
  count?: number;
}

export const CandidateGridSkeleton: FC<CandidateGridSkeletonProps> = (
  props,
) => {
  const { count = 8 } = props;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CandidateCardSkeleton key={index} />
      ))}
    </div>
  );
};

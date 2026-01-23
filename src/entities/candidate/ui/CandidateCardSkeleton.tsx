import type { FC } from "react";
import {
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonButton,
  SkeletonText,
} from "../../../shared/ui/Skeleton";

/**
 * CandidateCardSkeleton - loading placeholder for CandidateCard
 * Matches the exact layout of CandidateCard component for seamless loading experience
 */
export const CandidateCardSkeleton: FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      {/* Avatar and Status Badge Row */}
      <div className="flex items-start justify-between mb-4">
        <SkeletonAvatar size="md" />
        <SkeletonBadge />
      </div>

      {/* Name and Position */}
      <div className="mb-6 space-y-2">
        {/* Name - larger text */}
        <SkeletonText size="lg" lines={1} className="w-3/4" />
        {/* Position - smaller text */}
        <SkeletonText size="sm" lines={1} className="w-1/2" />
      </div>

      {/* View Details Button */}
      <SkeletonButton fullWidth />
    </div>
  );
};

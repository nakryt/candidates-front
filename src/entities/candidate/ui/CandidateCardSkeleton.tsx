import type { FC } from "react";
import {
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonButton,
  SkeletonText,
} from "../../../shared/ui/Skeleton";

export const CandidateCardSkeleton: FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <SkeletonAvatar size="md" />
        <SkeletonBadge />
      </div>

      <div className="mb-6 space-y-2">
        <SkeletonText size="lg" lines={1} className="w-3/4" />
        <SkeletonText size="sm" lines={1} className="w-1/2" />
      </div>

      <SkeletonButton fullWidth />
    </div>
  );
};

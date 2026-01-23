import type { FC } from "react";
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonText,
} from "../../../shared/ui/Skeleton";

/**
 * CandidateDetailsSkeleton - loading placeholder for CandidateDetails modal
 * Matches the exact layout of CandidateDetails component including all sections:
 * - Header with avatar, name, position, contact info
 * - Two-column layout with description, skills, and status sections
 */
export const CandidateDetailsSkeleton: FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Section - Avatar, Name, Position, Contact */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <SkeletonAvatar size="xl" />
        <div className="w-full text-center sm:text-left pt-2 space-y-4">
          {/* Name */}
          <SkeletonText size="2xl" lines={1} className="w-3/4 mx-auto sm:mx-0" />
          {/* Position */}
          <SkeletonText size="lg" lines={1} className="w-1/2 mx-auto sm:mx-0" />

          {/* Contact Info - Email and Phone */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </div>

      {/* Two Column Grid - Description/Skills and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Description and Skills */}
        <div className="space-y-6">
          {/* Description Section */}
          <div>
            <SkeletonText size="sm" lines={1} className="w-24 mb-3" />
            <SkeletonText size="base" lines={4} />
          </div>

          {/* Skills Section */}
          <div>
            <SkeletonText size="sm" lines={1} className="w-16 mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonBadge key={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Application Status Card */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 space-y-6">
            {/* Status Section Header */}
            <SkeletonText size="sm" lines={1} className="w-32" />

            {/* Status Select */}
            <Skeleton className="h-10 w-full" />

            {/* Divider and Applied Date */}
            <div className="pt-6 border-t border-gray-200">
              <Skeleton className="h-5 w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

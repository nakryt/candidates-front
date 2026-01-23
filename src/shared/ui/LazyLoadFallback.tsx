import type { FC } from "react";
import { CandidateGridSkeleton } from "../../entities/candidate/ui/CandidateGridSkeleton";
import { CandidateDetailsSkeleton } from "../../entities/candidate/ui/CandidateDetailsSkeleton";
import { Spinner } from "./Spinner";

interface LazyLoadFallbackProps {
  minHeight?: string;
  message?: string;
  variant?: "spinner" | "grid" | "details";
}

/**
 * Fallback component displayed while lazy-loaded components are being loaded
 * Provides a consistent loading experience across all lazy-loaded boundaries
 *
 * Variants:
 * - spinner: Simple spinner with message (for generic/small components)
 * - grid: Candidate grid skeleton (for CandidateGrid lazy loading)
 * - details: Candidate details skeleton (for CandidateDetails lazy loading)
 */
export const LazyLoadFallback: FC<LazyLoadFallbackProps> = ({
  minHeight = "200px",
  message = "Loading...",
  variant = "spinner",
}) => {
  // Use skeleton loaders for better perceived performance
  if (variant === "grid") {
    return <CandidateGridSkeleton count={8} />;
  }

  if (variant === "details") {
    return <CandidateDetailsSkeleton />;
  }

  // Fallback to spinner for generic components or legacy usage
  return (
    <div
      className="flex flex-col items-center justify-center space-y-3"
      style={{ minHeight }}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Spinner size="md" />
      <p className="text-sm text-gray-500 animate-pulse">{message}</p>
    </div>
  );
};

/**
 * Minimal inline spinner for smaller loading contexts
 * Used for modal/overlay lazy loading where skeleton doesn't make sense
 */
export const InlineLoadingFallback: FC = () => {
  return (
    <div className="flex items-center justify-center p-4" role="status">
      <Spinner size="sm" />
    </div>
  );
};

/**
 * Full-screen loading fallback for major route/page transitions
 */
export const FullScreenLoadingFallback: FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen space-y-4"
      role="status"
      aria-live="polite"
    >
      <Spinner size="lg" />
      <p className="text-base text-gray-500 font-medium animate-pulse">
        Loading application...
      </p>
    </div>
  );
};

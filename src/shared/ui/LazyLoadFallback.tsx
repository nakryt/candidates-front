import type { FC } from "react";
import { CandidateDetailsSkeleton } from "../../entities/candidate/ui/CandidateDetailsSkeleton";
import { CandidateGridSkeleton } from "../../entities/candidate/ui/CandidateGridSkeleton";
import { Spinner } from "./Spinner";

interface LazyLoadFallbackProps {
  minHeight?: string;
  message?: string;
  variant?: "spinner" | "grid" | "details";
}

export const LazyLoadFallback: FC<LazyLoadFallbackProps> = (props) => {
  const {
    minHeight = "200px",
    message = "Loading...",
    variant = "spinner",
  } = props;

  if (variant === "grid") {
    return <CandidateGridSkeleton count={8} />;
  }

  if (variant === "details") {
    return <CandidateDetailsSkeleton />;
  }

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

export const InlineLoadingFallback: FC = () => {
  return (
    <div className="flex items-center justify-center p-4" role="status">
      <Spinner size="sm" />
    </div>
  );
};

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

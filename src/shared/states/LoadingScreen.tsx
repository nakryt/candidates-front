import type { FC } from "react";
import { CandidateGridSkeleton } from "../../entities/candidate/ui/CandidateGridSkeleton";

/**
 * LoadingScreen - displays grid skeleton while candidates are loading
 * Provides better UX than spinner by showing the expected layout
 */
export const LoadingScreen: FC = () => {
  return <CandidateGridSkeleton count={8} />;
};

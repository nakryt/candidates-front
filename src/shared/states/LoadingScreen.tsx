import type { FC } from "react";
import { CandidateGridSkeleton } from "../../entities/candidate/ui/CandidateGridSkeleton";

export const LoadingScreen: FC = () => {
  return <CandidateGridSkeleton count={8} />;
};

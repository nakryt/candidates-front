import type { FC } from "react";
import { cn } from "../../lib/cn";
import { Skeleton } from "./Skeleton";

interface SkeletonBadgeProps {
  className?: string;
}
export const SkeletonBadge: FC<SkeletonBadgeProps> = ({ className }) => {
  return <Skeleton className={cn("h-6 w-20 rounded-full", className)} />;
};

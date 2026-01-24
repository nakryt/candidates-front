import type { FC } from "react";
import { cn } from "../../lib/cn";
import { Skeleton } from "./Skeleton";

interface SkeletonButtonProps {
  fullWidth?: boolean;
  className?: string;
}
export const SkeletonButton: FC<SkeletonButtonProps> = (props) => {
  const { fullWidth = false, className } = props;

  return (
    <Skeleton
      className={cn("h-10", fullWidth ? "w-full" : "w-24", className)}
    />
  );
};

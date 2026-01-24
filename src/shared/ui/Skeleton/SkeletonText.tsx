import type { FC } from "react";
import { cn } from "../../lib/cn";
import { Skeleton } from "./Skeleton";

interface SkeletonTextProps {
  lines?: number;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  className?: string;
}

export const SkeletonText: FC<SkeletonTextProps> = (props) => {
  const { lines = 1, size = "base", className } = props;
  const heights = {
    xs: "h-3",
    sm: "h-3.5",
    base: "h-4",
    lg: "h-5",
    xl: "h-6",
    "2xl": "h-7",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn(
            heights[size],
            index === lines - 1 && lines > 1 && "w-4/5",
          )}
        />
      ))}
    </div>
  );
};

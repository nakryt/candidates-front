import type { FC } from "react";
import { cn } from "../../lib/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: FC<SkeletonProps> = (props) => {
  const {
    className,
    variant = "rectangular",
    width,
    height,
    animation = "pulse",
  } = props;
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse bg-gray-200",
    wave: "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer",
    none: "bg-gray-200",
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        animationClasses[animation],
        className,
      )}
      style={{ width, height }}
      role="status"
      aria-label="Loading..."
    />
  );
};

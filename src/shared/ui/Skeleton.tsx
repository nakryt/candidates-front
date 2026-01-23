import type { FC } from "react";
import { cn } from "../lib/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
  animation?: "pulse" | "wave" | "none";
}

/**
 * Base Skeleton component for creating loading placeholders
 * Provides a shimmer/pulse effect for better perceived performance
 */
export const Skeleton: FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}) => {
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

/**
 * Text skeleton with predefined heights for different text sizes
 */
export const SkeletonText: FC<{
  lines?: number;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  className?: string;
}> = ({ lines = 1, size = "base", className }) => {
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
            // Make last line shorter for more natural look
            index === lines - 1 && lines > 1 && "w-4/5",
          )}
        />
      ))}
    </div>
  );
};

/**
 * Avatar skeleton matching Avatar component sizes
 */
export const SkeletonAvatar: FC<{
  size?: "sm" | "md" | "lg" | "xl";
}> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return <Skeleton variant="circular" className={sizeClasses[size]} />;
};

/**
 * Button skeleton
 */
export const SkeletonButton: FC<{
  fullWidth?: boolean;
  className?: string;
}> = ({ fullWidth = false, className }) => {
  return (
    <Skeleton
      className={cn("h-10", fullWidth ? "w-full" : "w-24", className)}
    />
  );
};

/**
 * Badge/Chip skeleton
 */
export const SkeletonBadge: FC<{
  className?: string;
}> = ({ className }) => {
  return <Skeleton className={cn("h-6 w-20 rounded-full", className)} />;
};

import type { FC } from "react";
import { Skeleton } from "./Skeleton";

interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
}
export const SkeletonAvatar: FC<SkeletonAvatarProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return <Skeleton variant="circular" className={sizeClasses[size]} />;
};

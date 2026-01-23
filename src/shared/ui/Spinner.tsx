import type { FC } from "react";
import { cn } from "../lib/cn";
import { Loader2 } from "./icons";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: FC<SpinnerProps> = (props) => {
  const { size = "md", className } = props;
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Loader2
      className={cn("animate-spin text-blue-600", sizes[size], className)}
    />
  );
};

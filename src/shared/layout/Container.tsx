import type { FC, ReactNode } from "react";
import { cn } from "../lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container: FC<ContainerProps> = (props) => {
  const { children, className } = props;
  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
};

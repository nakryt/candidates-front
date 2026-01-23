import type { FC } from "react";
import { cn } from "../lib/cn";

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar: FC<AvatarProps> = (props) => {
  const { name, imageUrl, size = "md", className } = props;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-xl",
    xl: "h-24 w-24 text-3xl",
  };

  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-red-100 text-red-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
  ];

  const colorIndex = name.length % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold overflow-hidden",
        !imageUrl && colorClass,
        sizes[size],
        className,
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};

import type { FC } from "react";
import { Users } from "../ui/icons";

export const Header: FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Candidate<span className="text-blue-600">Hub</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live Dashboard
          </div>
        </div>
      </div>
    </header>
  );
};

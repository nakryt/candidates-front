import type { FC } from "react";
import { SearchX } from "../ui/icons";

/**
 * EmptyState component - displays message when no candidates match filters
 * Lazy-loaded since it's only shown in specific conditions
 */
const EmptyState: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <SearchX className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        No candidates found
      </h3>
      <p className="text-gray-500 max-w-sm">
        We couldn't find any candidates matching your current search or filter
        criteria.
      </p>
    </div>
  );
};

export default EmptyState;

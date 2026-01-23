import type { FC } from "react";
import { Button } from "../ui/Button";
import { AlertCircle, RefreshCw } from "../ui/icons";

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

/**
 * ErrorScreen component - displays error state with retry action
 * Lazy-loaded since it's only shown when an error occurs
 */
const ErrorScreen: FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-red-50 rounded-2xl border border-red-100">
      <div className="bg-red-100 p-3 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-red-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-red-700 mb-6 max-w-md">{message}</p>
      <Button variant="danger" onClick={onRetry}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Try again
      </Button>
    </div>
  );
};

export default ErrorScreen;

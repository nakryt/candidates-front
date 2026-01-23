import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

/**
 * Hook to access toast functionality
 *
 * Must be used within a ToastProvider
 *
 * @throws {Error} If used outside of ToastProvider
 * @returns {ToastContextValue} Toast context with showToast and dismissToast methods
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};

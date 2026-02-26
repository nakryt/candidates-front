import { useEffect, type FC } from "react";
import type { Toast as ToastType } from "../../types/toast";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "../icons";

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const toastStyles = {
  success: {
    container: "bg-green-50 border-green-200 text-green-900",
    icon: "text-green-600",
    IconComponent: CheckCircle,
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-900",
    icon: "text-red-600",
    IconComponent: AlertCircle,
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-900",
    icon: "text-blue-600",
    IconComponent: Info,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-900",
    icon: "text-yellow-600",
    IconComponent: AlertTriangle,
  },
};

export const Toast: FC<ToastProps> = ({ toast, onDismiss }) => {
  const { container, icon, IconComponent } = toastStyles[toast.type];
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const containerClass = `
        ${container}
        flex items-start gap-3 p-4 border rounded-lg shadow-lg
        animate-slide-in-right
        min-w-[320px] max-w-md
      `;
  const buttonClass = `
        ${icon}
        flex-shrink-0 rounded-md p-1
        hover:bg-black/5
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
        transition-colors
      `;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={containerClass}
    >
      <IconComponent className={`${icon} h-5 w-5 flex-shrink-0 mt-0.5`} />

      <p className="flex-1 text-sm font-medium leading-relaxed">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Close notification"
        className={buttonClass}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

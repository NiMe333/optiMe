import { createContext, useContext, useRef, useState } from "react";
import AppToast from "@/components/AppToast";

type ToastType = "success" | "error" | "info";

type Toast = {
  message: string;
  type: ToastType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type ConfirmToastOptions = {
  message: string;
  type?: ToastType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
  showConfirmToast: (options: ConfirmToastOptions) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function hideToast() {
    clearTimer();
    setToast(null);
  }

  function showToast(message: string, type: ToastType = "info") {
    clearTimer();

    setToast({
      message,
      type,
    });

    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, 3000);
  }

  function showConfirmToast({
    message,
    type = "info",
    confirmText = "Ja",
    cancelText = "Ne",
    onConfirm,
    onCancel,
  }: ConfirmToastOptions) {
    clearTimer();

    setToast({
      message,
      type,
      confirmText,
      cancelText,
      onConfirm: async () => {
        setToast(null);
        await onConfirm?.();
      },
      onCancel: () => {
        setToast(null);
        onCancel?.();
      },
    });
  }

  return (
    <ToastContext.Provider value={{ showToast, showConfirmToast, hideToast }}>
      {children}

      {toast && (
        <AppToast
          message={toast.message}
          type={toast.type}
          confirmText={toast.confirmText}
          cancelText={toast.cancelText}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}

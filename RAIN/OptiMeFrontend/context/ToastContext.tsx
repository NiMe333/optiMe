import { createContext, useContext, useState } from "react";
import AppToast from "@/components/AppToast";
type ToastType = "success" | "error" | "info";

type Toast = {
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(message: string, type: ToastType = "info") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && <AppToast message={toast.message} type={toast.type} />}
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


import { toast as sonnerToast } from "sonner";
import * as React from "react";

// Define the toast context
type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number; // Adding duration property
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToastActionType = (toast: ToasterToast) => void;

const ToastContext = React.createContext<{
  toasts: ToasterToast[];
  addToast: ToasterToastActionType;
  updateToast: ToasterToastActionType;
  dismissToast: (toastId: string) => void;
  removeToast: (toastId: string) => void;
} | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const addToast: ToasterToastActionType = React.useCallback(
    (toast) => {
      setToasts((prevToasts) => {
        const nextToasts = [toast, ...prevToasts].slice(0, TOAST_LIMIT);
        return nextToasts;
      });
    },
    []
  );

  const updateToast: ToasterToastActionType = React.useCallback(
    (toast) => {
      setToasts((prevToasts) => {
        const toastIndex = prevToasts.findIndex((t) => t.id === toast.id);
        if (toastIndex === -1) return prevToasts;

        const nextToasts = [...prevToasts];
        nextToasts[toastIndex] = { ...nextToasts[toastIndex], ...toast };
        return nextToasts;
      });
    },
    []
  );

  const dismissToast = React.useCallback((toastId: string) => {
    setToasts((prevToasts) => {
      const updatedToasts = prevToasts.map((toast) =>
        toast.id === toastId ? { ...toast } : toast
      );
      return updatedToasts;
    });

    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => toast.id !== toastId)
      );
    }, TOAST_REMOVE_DELAY);
  }, []);

  const removeToast = React.useCallback((toastId: string) => {
    setToasts((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  const value = React.useMemo(
    () => ({
      toasts,
      addToast,
      updateToast,
      dismissToast,
      removeToast,
    }),
    [toasts, addToast, updateToast, dismissToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return {
    toasts: context.toasts,
    toast: (props: Omit<ToasterToast, "id">) => {
      context.addToast({ id: Math.random().toString(), ...props });
    },
    dismiss: (toastId: string) => context.dismissToast(toastId),
  };
};

// Export sonner toast for simpler usage scenarios
export { sonnerToast as toast };

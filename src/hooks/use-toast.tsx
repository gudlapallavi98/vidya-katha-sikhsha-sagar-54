
import * as React from "react"
import { Toaster as Sonner } from "sonner"

type ToastProps = React.ComponentProps<typeof Sonner>

const ToastProvider = ({ ...props }: ToastProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// Type for toast messages
export type ToastType = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

// Create a toast context
const ToastContext = React.createContext<{
  toast: (props: ToastType) => void;
}>({
  toast: () => {},
});

// Custom hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Create a toast action component that will inject the toast into any component
export const toast = ({ title, description, action, variant }: ToastType) => {
  const variantStyles = 
    variant === "destructive" 
      ? { style: { backgroundColor: "var(--destructive)", color: "var(--destructive-foreground)" } } 
      : {};
      
  return window.toast[variant === "destructive" ? "error" : "message"](
    title,
    {
      description,
      action,
      ...variantStyles,
    }
  );
};

export { ToastProvider };

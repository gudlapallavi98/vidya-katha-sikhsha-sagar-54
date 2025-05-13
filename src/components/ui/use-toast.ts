import { useToast } from "@/hooks/use-toast";
import { ToastActionElement, ToastProps } from "@/components/ui/toast";

// Re-export the useToast hook
export { useToast };

// Define toast action types
export type Toast = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  duration?: number;
} & Omit<ToastProps, "children">;

// Re-export the toast function (implementation from hooks)
export { ToastProvider } from "@/hooks/use-toast";

// Define toaster API with default export for convenience
const toast = (props: Toast) => {
  const { toast: hookToast } = useToast();
  return hookToast(props);
};

export { toast };


// Re-export from the hooks folder
import { useToast } from "@/hooks/use-toast";
import type { Toast } from "@/hooks/use-toast";
import { ToastProvider } from "@/hooks/use-toast";

// Export public API - the hook and type
export { useToast, ToastProvider, type Toast };

// Add toast function for direct access
export const toast = (props: Omit<Toast, "id">) => {
  const { toast } = useToast();
  return toast(props);
};

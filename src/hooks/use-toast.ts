
// Export the toast function from sonner
import { toast } from "sonner";

// Import the useToast hook from our UI component
import { useToast as useToastUI } from "@/components/ui/toast";

// Re-export them
export { toast };
export const useToast = useToastUI;

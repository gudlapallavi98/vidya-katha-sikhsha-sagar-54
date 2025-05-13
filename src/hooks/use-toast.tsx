
import * as React from "react"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as ToastPrimitive,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

// Define the Toast type
type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: "default" | "destructive";
}

// Define the context type
type ToastContextType = {
  toast: (props: Omit<Toast, "id"> & { id?: string }) => void;
  toasts: Toast[];
  dismiss: (toastId: string) => void;
}

// Create the context with null as default value
export const ToastContext = React.createContext<ToastContextType | null>(null)

// Custom hook to use the toast context
export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (context === null) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}

// Provider component
export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  // Add a new toast
  const toast = React.useCallback((props: Omit<Toast, "id"> & { id?: string }) => {
    const id = props.id || String(Date.now())
    setToasts((prevToasts) => [...prevToasts, { id, ...props }])
    return id
  }, [])

  // Remove a toast by ID
  const dismiss = React.useCallback((toastId: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
  }, [])
  
  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      <ToastPrimitive>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose onClick={() => dismiss(id)} />
            </Toast>
          );
        })}
        <ToastViewport />
      </ToastPrimitive>
    </ToastContext.Provider>
  )
}

// Re-export functions for use-toast.ts compatibility
export { toast, type Toast } from "@/components/ui/use-toast"

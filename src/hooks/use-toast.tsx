
import * as React from "react"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import { useToast as useToastPrimitive } from "@/components/ui/use-toast"

export const ToastContext = React.createContext<ReturnType<typeof useToastPrimitive> | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (context === null) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { toast, toasts, dismiss } = useToastPrimitive()
  
  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      <ToastProvider>
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
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

// Export toast function for convenience
export { toast } from "@/components/ui/use-toast"

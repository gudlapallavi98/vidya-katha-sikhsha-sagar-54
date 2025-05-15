
import * as React from "react";
import { 
  Toast, 
  ToastActionElement, 
  ToastProps 
} from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToastType = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToastType;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToastType>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToastType[];
}

export const ToastContext = React.createContext<{
  toasts: ToastType[];
  addToast: (props: Omit<ToastType, "id">) => string;
  updateToast: (props: Partial<ToastType> & { id: string }) => void;
  dismissToast: (toastId?: string) => void;
  removeToast: (toastId?: string) => void;
}>(undefined!);

function toastReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Side effects
      if (toastId) {
        setTimeout(() => {
          dispatchStore({
            type: "REMOVE_TOAST",
            toastId: toastId,
          });
        }, TOAST_REMOVE_DELAY);
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatchStore(action: Action) {
  memoryState = toastReducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  const addToast = React.useCallback(
    (props: Omit<ToastType, "id">) => {
      const id = String(Date.now());
      dispatchStore({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
          open: true,
        },
      });
      return id;
    },
    []
  );

  const updateToast = React.useCallback(
    (props: Partial<ToastType> & { id: string }) => {
      dispatchStore({
        type: "UPDATE_TOAST",
        toast: props,
      });
    },
    []
  );

  const dismissToast = React.useCallback((toastId?: string) => {
    dispatchStore({
      type: "DISMISS_TOAST",
      toastId,
    });
  }, []);

  const removeToast = React.useCallback((toastId?: string) => {
    dispatchStore({
      type: "REMOVE_TOAST",
      toastId,
    });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        addToast,
        updateToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    ...context,
    toast: (props: Omit<ToastType, "id">) => context.addToast(props),
  };
}

export type Toast = ToastType;

export { ToastProvider };

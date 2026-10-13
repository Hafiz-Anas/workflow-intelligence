"use client";

import * as React from "react";
import type { ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 1000;
const TOAST_DURATION = 5000;

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

type State = { toasts: ToasterToast[] };

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function setState(updater: (state: State) => State) {
  memoryState = updater(memoryState);
  listeners.forEach((listener) => listener(memoryState));
}

function dismiss(toastId?: string) {
  setState((state) => ({
    toasts: state.toasts.map((t) => (toastId === undefined || t.id === toastId ? { ...t, open: false } : t)),
  }));
  setTimeout(() => {
    setState((state) => ({
      toasts: state.toasts.filter((t) => (toastId === undefined ? t.open !== false : t.id !== toastId)),
    }));
  }, TOAST_REMOVE_DELAY);
}

type ToastInput = Omit<ToasterToast, "id">;

function toast(props: ToastInput) {
  const id = genId();
  setState((state) => ({
    toasts: [
      {
        ...props,
        id,
        open: true,
        duration: props.duration ?? TOAST_DURATION,
        onOpenChange: (open: boolean) => {
          if (!open) dismiss(id);
        },
      },
      ...state.toasts,
    ].slice(0, TOAST_LIMIT),
  }));
  return { id, dismiss: () => dismiss(id) };
}

function useToast() {
  const [state, setLocalState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setLocalState);
    return () => {
      const index = listeners.indexOf(setLocalState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { ...state, toast, dismiss };
}

export { useToast, toast };

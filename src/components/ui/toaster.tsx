"use client";

import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

const icons = {
  default: <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />,
  success: <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-fg" aria-hidden />,
  warning: <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-fg" aria-hidden />,
  destructive: <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />,
} as const;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="left">
      {toasts.map(({ id, title, description, variant, ...props }) => (
        <Toast key={id} variant={variant} {...props}>
          {icons[variant ?? "default"]}
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

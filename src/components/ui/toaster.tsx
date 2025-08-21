import { useToast } from "@/hooks/use-toast.ts";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
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
      <ToastViewport className="
        fixed bottom-0 left-0 right-0 flex flex-col items-center
        p-4 space-y-2
        sm:top-0 sm:right-0 sm:left-auto sm:bottom-auto
        "/>

    </ToastProvider>
  );
}

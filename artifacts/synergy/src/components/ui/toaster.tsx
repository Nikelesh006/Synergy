import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import type { ToastProps } from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const variant = (props as ToastProps).variant ?? "default"
        return (
          <Toast key={id} variant={variant} className="flex-col sm:flex-row items-stretch sm:items-start gap-2.5 sm:gap-3" {...props}>
            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
              <ToastIcon variant={variant} />
              <div className="grid gap-0.5 min-w-0 flex-1 pt-0.5">
                {title && <ToastTitle className="text-xs sm:text-sm font-semibold text-slate-900">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-[11px] sm:text-xs text-slate-600 leading-relaxed line-clamp-2">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action && (
              <div className="pl-11 sm:pl-0 sm:self-center shrink-0">
                {action}
              </div>
            )}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

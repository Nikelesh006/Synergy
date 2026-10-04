import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Check, Heart, AlertCircle, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 left-0 right-0 sm:left-auto sm:right-4 sm:bottom-4 z-[100] flex max-h-screen w-full flex-col-reverse gap-2.5 sm:gap-3 px-3.5 sm:px-0 sm:p-4 max-w-[420px] mx-auto sm:mx-0 pointer-events-none",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  cn(
    "group pointer-events-auto relative flex w-full overflow-hidden",
    "rounded-2xl border p-3.5 sm:p-4 pr-10",
    "bg-white !bg-white text-slate-900",
    "border-slate-200/90",
    "shadow-[0_20px_40px_-10px_rgba(15,23,42,0.18),0_8px_16px_-8px_rgba(15,23,42,0.10)]",
    "ring-1 ring-black/[0.04]",
    "transition-all duration-300",
    "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out",
    "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
    "data-[state=open]:slide-in-from-bottom-full sm:data-[state=open]:slide-in-from-bottom-full"
  ),
  {
    variants: {
      variant: {
        default: "",
        cart: "border-emerald-300/70 bg-white",
        wishlist: "border-rose-300/70 bg-white",
        destructive: "border-red-300/70 bg-white",
      },
      defaultVariants: {
        variant: "default",
      },
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastIcon = ({
  variant,
}: {
  variant?: "default" | "cart" | "wishlist" | "destructive"
}) => {
  const map: Record<
    NonNullable<typeof variant>,
    { Icon: React.ElementType; tone: string; ring: string }
  > = {
    default: {
      Icon: Info,
      tone: "bg-slate-900 text-white",
      ring: "ring-slate-900/10",
    },
    cart: {
      Icon: Check,
      tone: "bg-emerald-600 text-white",
      ring: "ring-emerald-600/20",
    },
    wishlist: {
      Icon: Heart,
      tone: "bg-rose-600 text-white",
      ring: "ring-rose-600/20",
    },
    destructive: {
      Icon: AlertCircle,
      tone: "bg-red-600 text-white",
      ring: "ring-red-600/20",
    },
  }
  const cfg = map[variant ?? "default"]
  const Icon = cfg.Icon
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 shadow-sm",
        cfg.tone,
        cfg.ring
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          variant === "wishlist" && "fill-current"
        )}
        strokeWidth={2.25}
      />
    </span>
  )
}

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-full px-3 text-xs font-semibold tracking-wide",
      "bg-slate-900 text-white shadow-sm",
      "transition-all hover:bg-slate-800 hover:shadow-md",
      "focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:ring-offset-1",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full",
      "bg-slate-100 text-slate-500 border border-slate-200/80",
      "opacity-100 transition-all",
      "hover:bg-slate-900 hover:text-white hover:border-slate-900",
      "focus:outline-none focus:ring-2 focus:ring-slate-900/30",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-tight tracking-tight text-slate-900", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("mt-0.5 text-[13px] leading-relaxed text-slate-500", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
}

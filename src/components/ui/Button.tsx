import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150",
          "disabled:cursor-not-allowed disabled:opacity-60",
          size === "md" ? "px-5 py-2.5 text-sm" : "px-3.5 py-1.5 text-xs",
          variant === "primary" &&
            "bg-signal-400 text-ink-950 shadow-glass-sm hover:bg-signal-300 active:bg-signal-500",
          variant === "secondary" &&
            "border border-ink-200 bg-white/70 text-ink-800 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-100 dark:hover:bg-white/[0.08]",
          variant === "ghost" &&
            "text-ink-600 hover:bg-ink-100/60 dark:text-ink-300 dark:hover:bg-white/[0.06]",
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

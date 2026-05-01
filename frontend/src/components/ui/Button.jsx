import { cn } from "../../utils/helpers.js";
import { Spinner } from "./Spinner.jsx";

const VARIANTS = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
  ghost:
    "bg-transparent text-slate-900 hover:bg-slate-100 active:bg-slate-100 dark:text-white dark:hover:bg-slate-800",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
};

export function Button({
  as: Comp = "button",
  variant = "primary",
  loading = false,
  disabled,
  className,
  children,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/40 focus:ring-offset-2 focus:ring-offset-white",
        "disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-950",
        VARIANTS[variant] ?? VARIANTS.primary,
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4" /> : null}
      {children}
    </Comp>
  );
}


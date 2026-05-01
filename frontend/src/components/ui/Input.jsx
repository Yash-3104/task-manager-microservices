import { forwardRef } from "react";
import { cn } from "../../utils/helpers.js";

export const Input = forwardRef(function Input({
  label,
  hint,
  error,
  className,
  containerClassName,
  as = "input",
  ...props
}, ref) {
  const Comp = as;
  const describedBy = hint ? `${props.id || props.name || "field"}_hint` : undefined;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label ? (
        <label className="block text-sm font-semibold text-slate-900 dark:text-white">
          {label}
        </label>
      ) : null}
      <Comp
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900",
          "shadow-sm outline-none transition",
          "focus:border-slate-300 focus:ring-2 focus:ring-slate-200/60",
          "dark:border-slate-800 dark:bg-slate-950/30 dark:text-white dark:focus:border-slate-700 dark:focus:ring-slate-800/60",
          error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200/60" : null,
          className
        )}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        ref={ref}
        {...props}
      />
      {hint ? (
        <div id={describedBy} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </div>
      ) : null}
      {error ? <div className="text-xs text-rose-600 dark:text-rose-200">{error}</div> : null}
    </div>
  );
});

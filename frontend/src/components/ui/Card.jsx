import { cn } from "../../utils/helpers.js";

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white shadow-soft",
        "dark:border-slate-800/70 dark:bg-slate-900/60",
        className
      )}
    >
      {children}
    </div>
  );
}


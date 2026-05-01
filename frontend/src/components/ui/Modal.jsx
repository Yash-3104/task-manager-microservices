import { useEffect } from "react";
import { cn } from "../../utils/helpers.js";

export function Modal({ open, title, description, children, onClose, footer }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
        onMouseDown={() => onClose?.()}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-soft",
            "dark:border-slate-800/70 dark:bg-slate-950"
          )}
          onMouseDown={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="border-b border-slate-200/70 p-5 dark:border-slate-800/70">
            <div className="text-base font-bold text-slate-900 dark:text-white">{title}</div>
            {description ? (
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {description}
              </div>
            ) : null}
          </div>
          <div className="p-5">{children}</div>
          {footer ? (
            <div className="border-t border-slate-200/70 p-5 dark:border-slate-800/70">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}


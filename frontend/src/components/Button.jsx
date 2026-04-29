import Spinner from "./Spinner.jsx";

export default function Button({
  children,
  className = "",
  variant = "primary",
  loading = false,
  disabled,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition " +
    "focus:outline-none focus:ring-2 focus:ring-slate-400/40 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
    secondary:
      "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:ring-slate-800 dark:hover:bg-slate-800",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}


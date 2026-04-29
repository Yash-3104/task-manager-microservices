export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </div>
      ) : null}
      <input
        className={[
          "w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-slate-200",
          "placeholder:text-slate-400 focus:ring-2 focus:ring-slate-400/40",
          "dark:bg-slate-900 dark:text-white dark:ring-slate-800",
          error ? "ring-rose-300 focus:ring-rose-300/40" : "",
          className
        ].join(" ")}
        {...props}
      />
      {error ? (
        <div className="mt-1 text-sm text-rose-600 dark:text-rose-400">{error}</div>
      ) : null}
    </label>
  );
}


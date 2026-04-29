export default function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl bg-white/80 p-5 shadow-soft ring-1 ring-slate-200 backdrop-blur",
        "dark:bg-slate-900/70 dark:ring-slate-800",
        className
      ].join(" ")}
    >
      {children}
    </div>
  );
}


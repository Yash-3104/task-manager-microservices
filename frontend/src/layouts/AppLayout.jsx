import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { useTheme } from "../app/providers.jsx";
import { useAuth } from "../hooks/useAuth.js";

export function AppLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const logout = useAuth((s) => s.logout);

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white shadow-soft dark:bg-white dark:text-slate-900">
              TM
            </div>
            <div>
              <div className="text-sm font-semibold leading-5 text-slate-900 dark:text-white">
                Task Manager
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Dashboard
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                [
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                ].join(" ")
              }
            >
              Overview
            </NavLink>
            <Button variant="ghost" onClick={toggleTheme}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </Button>
            <Button variant="secondary" onClick={onLogout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

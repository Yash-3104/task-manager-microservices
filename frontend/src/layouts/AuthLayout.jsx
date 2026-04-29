import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../services/api.js";

export default function AuthLayout() {
  const token = getAccessToken();
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full items-center gap-10 md:grid-cols-2">
          <div className="hidden md:block">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900/60 dark:text-slate-200 dark:ring-slate-800">
              Task Manager
              <span className="text-slate-400">•</span>
              Microservices UI
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Stay on top of work with a simple, modern dashboard.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
              Secure JWT auth, clean task creation, and at-a-glance stats — built to feel
              like a real SaaS product.
            </p>
          </div>
          <div className="w-full">
            <Outlet />
            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              By continuing you agree to basic usage & security best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


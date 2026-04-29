import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { api, getApiErrorMessage, setAuthTokens } from "../services/api.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => location.state?.from || "/dashboard", [location]);

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await api.post("/api/auth/login", {
        username: emailOrUsername,
        password
      });

      const accessToken = res?.data?.accessToken ?? res?.data?.token ?? res?.data?.access_token;
      const refreshToken = res?.data?.refreshToken ?? res?.data?.refresh_token;

      if (!accessToken) throw new Error("Login succeeded but token was not returned.");

      setAuthTokens({ accessToken, refreshToken });
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Sign in
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Use your username (or email) and password.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input
          label="Email / Username"
          placeholder="you@example.com"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error ? (
          <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900">
            {error}
          </div>
        ) : null}

        <Button type="submit" className="w-full" loading={submitting}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
        New here?{" "}
        <Link
          to="/register"
          className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-white"
        >
          Create an account
        </Link>
      </div>
    </Card>
  );
}

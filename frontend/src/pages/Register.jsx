import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Select from "../components/Select.jsx";
import Button from "../components/Button.jsx";
import { api, getApiErrorMessage } from "../services/api.js";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/api/auth/register", { username, password, role });
      toast.success("Account created. Please sign in.");
      navigate("/login", { replace: true });
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
        Create account
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Choose a username, set a password, and pick a role.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input
          label="Username"
          placeholder="yourname"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </Select>

        {error ? (
          <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900">
            {error}
          </div>
        ) : null}

        <Button type="submit" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>

      <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-white"
        >
          Sign in
        </Link>
      </div>
    </Card>
  );
}


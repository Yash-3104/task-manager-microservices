import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Select from "../components/Select.jsx";
import Spinner from "../components/Spinner.jsx";
import { api, getApiErrorMessage, getAccessToken, getJwtPayload } from "../services/api.js";

function normalizeStats(data) {
  const d = data ?? {};
  return {
    totalTasks: Number(d.totalTasks ?? d.total ?? d.total_tasks ?? 0),
    completedTasks: Number(d.completedTasks ?? d.completed ?? d.completed_tasks ?? 0),
    pendingTasks: Number(d.pendingTasks ?? d.pending ?? d.pending_tasks ?? 0)
  };
}

async function fetchStats() {
  try {
    const res = await api.get("/api/tasks/dashboard");
    return normalizeStats(res.data);
  } catch (err) {
    if (err?.response?.status === 404) {
      const res = await api.get("/api/tasks/stats");
      return normalizeStats(res.data);
    }
    throw err;
  }
}

async function createTask(payload) {
  try {
    const res = await api.post("/api/tasks", payload);
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      const token = getAccessToken();
      const jwt = token ? getJwtPayload(token) : null;
      const userId = jwt?.userId ?? jwt?.id ?? jwt?.subId ?? null;
      if (!userId) throw err;
      const res = await api.post(`/api/tasks/${userId}`, payload);
      return res.data;
    }
    throw err;
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const canSubmit = useMemo(() => title.trim().length > 0 && !creating, [title, creating]);

  async function load() {
    setLoadingStats(true);
    setStatsError("");
    try {
      const s = await fetchStats();
      setStats(s);
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setStatsError(msg);
    } finally {
      setLoadingStats(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setCreating(true);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null
      });
      toast.success("Task created.");
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
      setShowCreate(false);
      await load();
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Overview
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Your task stats and a quick way to create new work.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={load} disabled={loadingStats}>
            Refresh
          </Button>
          <Button onClick={() => setShowCreate((s) => !s)}>
            {showCreate ? "Close" : "Create Task"}
          </Button>
        </div>
      </div>

      {loadingStats ? (
        <Card className="flex items-center gap-3">
          <Spinner className="h-5 w-5" />
          <div className="text-sm text-slate-600 dark:text-slate-300">Loading stats…</div>
        </Card>
      ) : statsError ? (
        <Card>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            Couldn’t load dashboard stats
          </div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{statsError}</div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Total tasks
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {stats.totalTasks}
            </div>
          </Card>
          <Card>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Completed
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {stats.completedTasks}
            </div>
          </Card>
          <Card>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Pending
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {stats.pendingTasks}
            </div>
          </Card>
        </div>
      )}

      {showCreate ? (
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-base font-semibold text-slate-900 dark:text-white">
                Create a task
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Keep it short and actionable.
              </div>
            </div>
          </div>

          <form onSubmit={onCreate} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Title"
                placeholder="e.g. Prepare sprint demo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Description"
                placeholder="A quick note (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </Select>
            <Input
              label="Due date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" type="button" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={creating} disabled={!canSubmit}>
                Create
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
    </div>
  );
}


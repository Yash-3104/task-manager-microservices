import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { TaskFilters } from "../features/tasks/components/TaskFilters.jsx";
import { TaskForm } from "../features/tasks/components/TaskForm.jsx";
import { TaskTable } from "../features/tasks/components/TaskTable.jsx";
import { KanbanBoard } from "../features/tasks/components/KanbanBoard.jsx";
import { PRIORITY_LABELS, STATUS_LABELS, TASK_PRIORITIES, TASK_STATUSES } from "../utils/constants.js";
import { cn, isOverdue } from "../utils/helpers.js";
import { useTasks } from "../hooks/useTasks.js";

function StatCard({ title, value, tone = "slate", icon }) {
  const tones = {
    slate: "bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-900/30 dark:text-slate-200 dark:ring-slate-800",
    emerald:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200 dark:ring-emerald-900",
    indigo:
      "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-200 dark:ring-indigo-900",
    rose: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:ring-rose-900"
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </div>
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-2xl ring-1 ring-inset", tones[tone] ?? tones.slate)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-bold text-slate-900 dark:text-white">{title}</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</div>
        </div>
      </div>
      <div className="mt-5 h-[280px]">{children}</div>
    </Card>
  );
}

export function Dashboard() {
  const tasks = useTasks((s) => s.tasks);
  const loading = useTasks((s) => s.loading);
  const error = useTasks((s) => s.error);
  const fetchTasks = useTasks((s) => s.fetchTasks);
  const createTask = useTasks((s) => s.createTask);
  const updateTask = useTasks((s) => s.updateTask);
  const deleteTask = useTasks((s) => s.deleteTask);

  const [view, setView] = useState("table"); // table | kanban
  const [filters, setFilters] = useState({ search: "", status: "", priority: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [statusUpdatingIds, setStatusUpdatingIds] = useState(() => new Set());

  useEffect(() => {
    fetchTasks().catch(() => {});
  }, [fetchTasks]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return tasks
      .filter((t) => (filters.status ? t.status === filters.status : true))
      .filter((t) => (filters.priority ? t.priority === filters.priority : true))
      .filter((t) => (q ? (t.title || "").toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q) : true))
      .slice()
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }, [tasks, filters]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "DONE").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const overdue = tasks.filter((t) => isOverdue(t)).length;
    return { total, completed, inProgress, overdue };
  }, [tasks]);

  const byStatus = useMemo(
    () =>
      TASK_STATUSES.map((s) => ({
        name: STATUS_LABELS[s] ?? s,
        key: s,
        value: tasks.filter((t) => t.status === s).length
      })).filter((d) => d.value > 0),
    [tasks]
  );

  const byPriority = useMemo(
    () =>
      TASK_PRIORITIES.map((p) => ({
        name: PRIORITY_LABELS[p] ?? p,
        key: p,
        value: tasks.filter((t) => t.priority === p).length
      })),
    [tasks]
  );

  async function onSubmitTask(payload) {
    setSubmitting(true);
    try {
      if (editingTask) await updateTask(editingTask.id, payload);
      else await createTask(payload);
      setShowForm(false);
      setEditingTask(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function onUpdateStatus(task, nextStatus) {
    if (task.status === nextStatus) return;
    setStatusUpdatingIds((prev) => new Set(prev).add(task.id));
    try {
      await updateTask(task.id, { status: nextStatus }, { silent: true });
    } finally {
      setStatusUpdatingIds((prev) => {
        const n = new Set(prev);
        n.delete(task.id);
        return n;
      });
    }
  }

  async function onMoveTask(taskId, patch) {
    await updateTask(taskId, patch, { silent: true });
  }

  async function onConfirmDelete() {
    if (!deleteConfirm) return;
    const t = deleteConfirm;
    setDeleteConfirm(null);
    await deleteTask(t.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Analytics + workflows in one clean SaaS workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => fetchTasks()} disabled={loading}>
            Refresh
          </Button>
          <Button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            New task
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            Couldn’t load tasks
          </div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{error}</div>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total tasks"
          value={stats.total}
          icon={<span className="text-sm font-bold">Σ</span>}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          tone="emerald"
          icon={<span className="text-sm font-bold">✓</span>}
        />
        <StatCard
          title="In progress"
          value={stats.inProgress}
          tone="indigo"
          icon={<span className="text-sm font-bold">↻</span>}
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          tone="rose"
          icon={<span className="text-sm font-bold">!</span>}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Tasks by status" subtitle="Distribution across your workflow.">
          {loading ? (
            <div className="grid h-full place-items-center text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" /> Loading…
              </div>
            </div>
          ) : byStatus.length === 0 ? (
            <div className="grid h-full place-items-center text-sm text-slate-600 dark:text-slate-300">
              Create a task to see analytics.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={90} innerRadius={55} paddingAngle={2}>
                  {byStatus.map((entry) => (
                    <Cell key={entry.key} fill={entry.key === "DONE" ? "#10b981" : entry.key === "IN_PROGRESS" ? "#6366f1" : "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: 12,
                    color: "#fff"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Tasks by priority" subtitle="Balance urgency across your work.">
          {loading ? (
            <div className="grid h-full place-items-center text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" /> Loading…
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPriority} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="name" stroke="rgba(148,163,184,0.8)" fontSize={12} />
                <YAxis allowDecimals={false} stroke="rgba(148,163,184,0.8)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: 12,
                    color: "#fff"
                  }}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {byPriority.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={entry.key === "HIGH" ? "#f43f5e" : entry.key === "MEDIUM" ? "#f59e0b" : "#0ea5e9"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <div className="text-base font-bold text-slate-900 dark:text-white">
              Work view
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Switch between a table and a drag-and-drop Kanban board.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition",
                  view === "table"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                )}
                onClick={() => setView("table")}
                type="button"
              >
                Table view
              </button>
              <button
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition",
                  view === "kanban"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                )}
                onClick={() => setView("kanban")}
                type="button"
              >
                Kanban view
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <TaskFilters
            search={filters.search}
            status={filters.status}
            priority={filters.priority}
            onSearchChange={(v) => setFilters((f) => ({ ...f, search: v }))}
            onStatusChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            onPriorityChange={(v) => setFilters((f) => ({ ...f, priority: v }))}
          />
        </div>
      </Card>

      {view === "table" ? (
        <TaskTable
          tasks={filtered}
          loading={loading}
          statusUpdatingIds={statusUpdatingIds}
          onEditTask={(t) => {
            setEditingTask(t);
            setShowForm(true);
          }}
          onDeleteTask={(t) => setDeleteConfirm(t)}
          onUpdateStatus={onUpdateStatus}
        />
      ) : (
        <KanbanBoard
          tasks={filtered}
          onMoveTask={onMoveTask}
          onEditTask={(t) => {
            setEditingTask(t);
            setShowForm(true);
          }}
        />
      )}

      <Modal
        open={showForm}
        title={editingTask ? "Edit task" : "Create task"}
        description="Keep titles short and outcomes clear."
        onClose={() => {
          if (submitting) return;
          setShowForm(false);
          setEditingTask(null);
        }}
      >
        <TaskForm
          initialTask={editingTask}
          submitting={submitting}
          onSubmit={onSubmitTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      </Modal>

      <Modal
        open={Boolean(deleteConfirm)}
        title="Delete task?"
        description="This action can’t be undone."
        onClose={() => setDeleteConfirm(null)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <div className="text-sm text-slate-600 dark:text-slate-300">
          {deleteConfirm ? (
            <>
              You’re about to delete <span className="font-semibold">{deleteConfirm.title}</span>.
            </>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}

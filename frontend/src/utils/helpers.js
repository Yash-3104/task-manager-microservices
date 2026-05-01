import { PRIORITY_LABELS, STATUS_LABELS } from "./constants.js";

export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function parseISODate(dateLike) {
  if (!dateLike) return null;
  const d = new Date(dateLike);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(dateLike) {
  const d = parseISODate(dateLike);
  if (!d) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export function isOverdue(task, now = new Date()) {
  if (!task?.dueDate) return false;
  if ((task?.status || "").toUpperCase() === "DONE") return false;
  const due = parseISODate(task.dueDate);
  if (!due) return false;
  const endOfDue = new Date(due);
  endOfDue.setHours(23, 59, 59, 999);
  return endOfDue.getTime() < now.getTime();
}

export function taskStatusLabel(status) {
  const key = (status || "").toUpperCase();
  return STATUS_LABELS[key] ?? status ?? "";
}

export function taskPriorityLabel(priority) {
  const key = (priority || "").toUpperCase();
  return PRIORITY_LABELS[key] ?? priority ?? "";
}

export function normalizeTask(raw) {
  const t = raw ?? {};
  return {
    id: t.id ?? t.taskId ?? t._id ?? t.task_id,
    title: t.title ?? "",
    description: t.description ?? "",
    status: (t.status ?? "TODO").toUpperCase(),
    priority: (t.priority ?? "MEDIUM").toUpperCase(),
    startDate: t.startDate ?? t.start_date ?? null,
    dueDate: t.dueDate ?? t.due_date ?? null,
    assignedUsername: t.assignedUsername ?? t.assigned_username ?? null,
    createdAt: t.createdAt ?? t.created_at ?? null,
    updatedAt: t.updatedAt ?? t.updated_at ?? null
  };
}

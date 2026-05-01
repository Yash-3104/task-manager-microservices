import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Spinner } from "../../../components/ui/Spinner.jsx";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES
} from "../../../utils/constants.js";
import { cn, formatDate, isOverdue } from "../../../utils/helpers.js";

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/40"
        />
      ))}
    </div>
  );
}

export function TaskTable({
  tasks,
  loading,
  pendingTaskIds,
  onEditTask,
  onDeleteTask,
  onUpdateTask,
  onUpdateStatus
}) {
  const [page, setPage] = useState(1);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleDraft, setTitleDraft] = useState("");
  const pageSize = 10;

  const role = localStorage.getItem("tm_role");
  const username = localStorage.getItem("tm_username");
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return tasks.slice(start, start + pageSize);
  }, [tasks, safePage]);

  function go(delta) {
    setPage((value) => Math.min(Math.max(value + delta, 1), totalPages));
  }

  function startTitleEdit(task) {
    setEditingTitleId(task.id);
    setTitleDraft(task.title || "");
  }

  function cancelTitleEdit() {
    setEditingTitleId(null);
    setTitleDraft("");
  }

  async function saveTitle(task) {
    const nextTitle = titleDraft.trim();
    if (!nextTitle || nextTitle === task.title) {
      cancelTitleEdit();
      return;
    }

    try {
      await onUpdateTask?.(task, { title: nextTitle });
      cancelTitleEdit();
    } catch {
      return;
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            Tasks
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Click a title, status, or priority to update it inline.
          </div>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-300">
          {tasks.length} total
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        {loading ? (
          <TableSkeleton />
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
            No tasks match your filters.
          </div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Priority</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Due date</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
              {pageItems.map((task) => {
                const overdue = isOverdue(task);
                const pending = pendingTaskIds?.has?.(String(task.id));
                const canEdit = isAdmin || task.assignedUsername === username;
                const canDelete = isAdmin;
                const isTitleEditing = editingTitleId === task.id;

                return (
                  <tr key={task.id} className="align-top">
                    <td className="py-4 pr-4">
                      {isTitleEditing ? (
                        <form
                          onSubmit={(event) => {
                            event.preventDefault();
                            saveTitle(task);
                          }}
                        >
                          <Input
                            autoFocus
                            value={titleDraft}
                            onChange={(event) => setTitleDraft(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Escape") cancelTitleEdit();
                            }}
                            disabled={pending}
                            className="py-1.5"
                            containerClassName="space-y-0"
                          />
                        </form>
                      ) : (
                        <button
                          type="button"
                          className={cn(
                            "block max-w-[360px] truncate text-left font-semibold text-slate-900",
                            "hover:text-slate-700 disabled:cursor-not-allowed disabled:hover:text-slate-900",
                            "dark:text-white dark:hover:text-slate-200 dark:disabled:hover:text-white"
                          )}
                          onClick={() => startTitleEdit(task)}
                          disabled={!canEdit || pending}
                          title={canEdit ? "Click to edit title" : undefined}
                        >
                          {task.title || "Untitled"}
                        </button>
                      )}

                      {task.description ? (
                        <div className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                          {task.description}
                        </div>
                      ) : null}

                      {isAdmin && task.assignedUsername ? (
                        <div className="mt-1 text-xs text-slate-400">
                          Owner: {task.assignedUsername}
                        </div>
                      ) : null}
                    </td>

                    <td className="py-4 pr-4">
                      <Input
                        as="select"
                        value={task.priority}
                        onChange={(event) =>
                          Promise.resolve(
                            onUpdateTask?.(task, { priority: event.target.value })
                          ).catch(() => {})
                        }
                        disabled={!canEdit || pending}
                        className="min-w-[120px] py-1.5"
                        containerClassName="space-y-0"
                        aria-label={`Priority for ${task.title || "task"}`}
                      >
                        {TASK_PRIORITIES.map((priority) => (
                          <option key={priority} value={priority}>
                            {PRIORITY_LABELS[priority] ?? priority}
                          </option>
                        ))}
                      </Input>
                    </td>

                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <Input
                          as="select"
                          value={task.status}
                          onChange={(event) =>
                            Promise.resolve(onUpdateStatus?.(task, event.target.value)).catch(
                              () => {}
                            )
                          }
                          disabled={!canEdit || pending}
                          className="min-w-[150px] py-1.5"
                          containerClassName="space-y-0"
                          aria-label={`Status for ${task.title || "task"}`}
                        >
                          {TASK_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status] ?? status}
                            </option>
                          ))}
                        </Input>

                        {pending ? <Spinner className="h-4 w-4" /> : null}
                      </div>
                    </td>

                    <td className="py-4 pr-4">
                      <div
                        className={cn(
                          overdue
                            ? "font-semibold text-rose-600 dark:text-rose-200"
                            : "text-slate-600 dark:text-slate-300"
                        )}
                      >
                        {task.dueDate ? formatDate(task.dueDate) : "—"}
                      </div>

                      {overdue ? (
                        <div className="mt-1 text-xs text-rose-600 dark:text-rose-200">
                          Overdue
                        </div>
                      ) : null}
                    </td>

                    <td className="py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        {canEdit ? (
                          <Button
                            variant="secondary"
                            onClick={() => onEditTask?.(task)}
                            disabled={pending}
                          >
                            Edit
                          </Button>
                        ) : null}

                        {canDelete ? (
                          <Button
                            variant="danger"
                            onClick={() => onDeleteTask?.(task)}
                            disabled={pending}
                          >
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && tasks.length > 0 ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Page {safePage} of {totalPages}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => go(-1)}
              disabled={safePage === 1}
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              onClick={() => go(1)}
              disabled={safePage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

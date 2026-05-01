import { useMemo, useState } from "react";
import { Badge } from "../../../components/ui/Badge.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Spinner } from "../../../components/ui/Spinner.jsx";
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
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
  statusUpdatingIds,
  onEditTask,
  onDeleteTask,
  onUpdateStatus
}) {
  const [page, setPage] = useState(1);
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
    setPage((p) => {
      const next = p + delta;
      if (next < 1) return 1;
      if (next > totalPages) return totalPages;
      return next;
    });
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            Tasks
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Inline status updates, quick edits, and clean pagination.
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
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
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
                const updating = statusUpdatingIds?.has?.(task.id);
                const statusColor = STATUS_COLORS[task.status] ?? "slate";
                const priorityColor = PRIORITY_COLORS[task.priority] ?? "slate";
                const canEdit = isAdmin || task.assignedUsername === username;
                const canDelete = isAdmin;

                return (
                  <tr key={task.id} className="align-top">
                    <td className="py-4 pr-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {task.title || "Untitled"}
                      </div>

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
                      <Badge color={priorityColor}>
                        {PRIORITY_LABELS[task.priority] ?? task.priority}
                      </Badge>
                    </td>

                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <Badge color={statusColor}>
                          {STATUS_LABELS[task.status] ?? task.status}
                        </Badge>

                        <div className="min-w-[160px]">
                          <Input
                            as="select"
                            value={task.status}
                            onChange={(e) =>
                              onUpdateStatus?.(task, e.target.value)
                            }
                            disabled={!canEdit || updating}
                            className="py-1"
                            containerClassName="space-y-0"
                          >
                            {TASK_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </Input>
                        </div>

                        {updating ? <Spinner className="h-4 w-4" /> : null}
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
                          >
                            Edit
                          </Button>
                        ) : null}

                        {canDelete ? (
                          <Button
                            variant="danger"
                            onClick={() => onDeleteTask?.(task)}
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
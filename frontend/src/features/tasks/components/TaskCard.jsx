import { Badge } from "../../../components/ui/Badge.jsx";
import { cn, formatDate, isOverdue, taskPriorityLabel } from "../../../utils/helpers.js";
import { PRIORITY_COLORS } from "../../../utils/constants.js";

export function TaskCard({ task, draggable, onDragStart, onDragEnd, className, onClick }) {
  const overdue = isOverdue(task);
  const priorityColor = PRIORITY_COLORS[task.priority] ?? "slate";

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm",
        "transition hover:-translate-y-[1px] hover:shadow-md active:translate-y-0",
        "dark:border-slate-800/70 dark:bg-slate-950/40",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {task.title || "Untitled task"}
          </div>
          <div className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
            {task.description || "No description"}
          </div>
        </div>
        <Badge color={priorityColor}>{taskPriorityLabel(task.priority)}</Badge>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className={cn(overdue ? "text-rose-600 dark:text-rose-200" : null)}>
          {task.dueDate ? `Due ${formatDate(task.dueDate)}` : "No due date"}
        </div>
        {overdue ? <span className="font-semibold">Overdue</span> : null}
      </div>
    </div>
  );
}


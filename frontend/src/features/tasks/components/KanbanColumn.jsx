import { Badge } from "../../../components/ui/Badge.jsx";
import { STATUS_COLORS, STATUS_LABELS } from "../../../utils/constants.js";
import { cn } from "../../../utils/helpers.js";
import { TaskCard } from "./TaskCard.jsx";

export function KanbanColumn({
  status,
  tasks,
  draggingId,
  onDropTask,
  onEditTask,
  onDragStart
}) {
  const label = STATUS_LABELS[status] ?? status;
  const color = STATUS_COLORS[status] ?? "slate";

  function onDragOver(e) {
    e.preventDefault();
  }

  function onDrop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/taskId");
    const fromStatus = e.dataTransfer.getData("text/fromStatus");
    if (!taskId) return;
    if (fromStatus === status) return;
    onDropTask?.({ taskId, toStatus: status, fromStatus });
  }

  return (
    <div
      className={cn(
        "flex min-h-[420px] flex-col rounded-2xl border border-slate-200/70 bg-white/60 p-3",
        "dark:border-slate-800/70 dark:bg-slate-900/20"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold text-slate-900 dark:text-white">{label}</div>
          <Badge color={color} className="px-2 py-0.5">
            {tasks.length}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Drop tasks here
          </div>
        ) : (
          tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              draggable
              onDragStart={(e) => onDragStart?.(e, t)}
              className={cn(draggingId === t.id ? "opacity-60" : null)}
              onClick={() => onEditTask?.(t)}
            />
          ))
        )}
      </div>
    </div>
  );
}


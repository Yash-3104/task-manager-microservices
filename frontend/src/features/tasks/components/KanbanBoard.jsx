import { useMemo, useState } from "react";
import { TASK_STATUSES } from "../../../utils/constants.js";
import { KanbanColumn } from "./KanbanColumn.jsx";

export function KanbanBoard({ tasks, onMoveTask, onEditTask }) {
  const [draggingId, setDraggingId] = useState(null);

  const byStatus = useMemo(() => {
    const groups = Object.fromEntries(TASK_STATUSES.map((s) => [s, []]));
    for (const t of tasks) {
      const key = groups[t.status] ? t.status : "TODO";
      groups[key].push(t);
    }
    return groups;
  }, [tasks]);

  function onDragStart(e, task) {
    setDraggingId(task.id);
    e.dataTransfer.setData("text/taskId", String(task.id));
    e.dataTransfer.setData("text/fromStatus", String(task.status));
    e.dataTransfer.effectAllowed = "move";
  }

  function onDropTask({ taskId, toStatus }) {
    setDraggingId(null);
    onMoveTask?.(taskId, { status: toStatus });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {TASK_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={byStatus[status] || []}
          draggingId={draggingId}
          onDropTask={onDropTask}
          onEditTask={onEditTask}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
}


import { Card } from "../../../components/ui/Card.jsx";
import { STATUS_LABELS } from "../../../utils/constants.js";

function activityCopy(item) {
  if (item.type === "created") return "created";
  if (item.type === "deleted") return "deleted";
  if (item.type === "status") {
    const from = STATUS_LABELS[item.fromStatus] ?? item.fromStatus;
    const to = STATUS_LABELS[item.toStatus] ?? item.toStatus;
    return `moved from ${from} to ${to}`;
  }
  return "updated";
}

function timeLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function ActivityFeed({ items = [] }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-base font-bold text-slate-900 dark:text-white">
          Recent activity
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          {items.length} shown
        </div>
      </div>

      <div className="mt-4 divide-y divide-slate-200/70 dark:divide-slate-800/70">
        {items.length === 0 ? (
          <div className="py-5 text-sm text-slate-600 dark:text-slate-300">
            Task changes will appear here.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </div>
                <div className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                  {activityCopy(item)}
                </div>
              </div>
              <div className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                {timeLabel(item.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

import { Input } from "../../../components/ui/Input.jsx";
import { TASK_PRIORITIES, TASK_STATUSES } from "../../../utils/constants.js";

export function TaskFilters({
  search,
  status,
  priority,
  searchInputRef,
  onSearchChange,
  onStatusChange,
  onPriorityChange
}) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Input
        ref={searchInputRef}
        label="Search"
        placeholder="Search tasks…"
        value={search}
        onChange={(e) => onSearchChange?.(e.target.value)}
        containerClassName="md:col-span-2"
      />
      <Input
        as="select"
        label="Status"
        value={status}
        onChange={(e) => onStatusChange?.(e.target.value)}
      >
        <option value="">All</option>
        {TASK_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Input>
      <Input
        as="select"
        label="Priority"
        value={priority}
        onChange={(e) => onPriorityChange?.(e.target.value)}
      >
        <option value="">All</option>
        {TASK_PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </Input>
    </div>
  );
}

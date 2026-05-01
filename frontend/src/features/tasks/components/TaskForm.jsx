import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/Button.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { TASK_PRIORITIES, TASK_STATUSES } from "../../../utils/constants.js";

export function TaskForm({ initialTask, submitting, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [status, setStatus] = useState(initialTask?.status ?? "TODO");
  const [priority, setPriority] = useState(initialTask?.priority ?? "MEDIUM");
  const [startDate, setStartDate] = useState((initialTask?.startDate ?? "").slice(0, 10));
  const [dueDate, setDueDate] = useState((initialTask?.dueDate ?? "").slice(0, 10));
  const [assignedUsername, setAssignedUsername] = useState(initialTask?.assignedUsername ?? "");

  const canSubmit = useMemo(() => title.trim().length > 0 && !submitting, [title, submitting]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      startDate: startDate || null,
      dueDate: dueDate || null,
      assignedUsername: assignedUsername.trim() || null
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <Input
        label="Title"
        placeholder="e.g. Prepare sprint demo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        containerClassName="md:col-span-2"
      />
      <Input
        label="Description"
        placeholder="Short summary (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        containerClassName="md:col-span-2"
      />
      <Input as="select" label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
        {TASK_PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </Input>
      <Input as="select" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
        {TASK_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Input>
      <Input label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <Input label="Due date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <Input
        label="Assigned to"
        placeholder="username (optional)"
        value={assignedUsername}
        onChange={(e) => setAssignedUsername(e.target.value)}
        containerClassName="md:col-span-2"
      />

      <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} disabled={!canSubmit}>
          {initialTask ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}


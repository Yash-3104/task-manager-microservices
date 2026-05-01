import { create } from "zustand";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../services/api.js";
import * as tasksApi from "./api.js";
import { normalizeTask } from "../../utils/helpers.js";

function normalizeList(data) {
  if (Array.isArray(data)) return data.map(normalizeTask);
  if (Array.isArray(data?.tasks)) return data.tasks.map(normalizeTask);
  if (Array.isArray(data?.content)) return data.content.map(normalizeTask);
  return [];
}

const ACTIVITY_LIMIT = 8;

function taskSignature(task) {
  return JSON.stringify({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    startDate: task.startDate,
    dueDate: task.dueDate,
    assignedUsername: task.assignedUsername,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  });
}

function reconcileTasks(current, incoming) {
  let changed = current.length !== incoming.length;
  const currentById = new Map(current.map((task) => [String(task.id), task]));

  const next = incoming.map((task, index) => {
    const existing = currentById.get(String(task.id));
    if (!existing) {
      changed = true;
      return task;
    }

    if (current[index]?.id !== existing.id) changed = true;
    if (taskSignature(existing) === taskSignature(task)) return existing;

    changed = true;
    return task;
  });

  return changed ? next : current;
}

function activity(type, task, meta = {}) {
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    type,
    taskId: task?.id,
    title: task?.title || "Untitled task",
    createdAt: new Date().toISOString(),
    ...meta
  };
}

function withPendingId(pendingTaskIds, id, shouldAdd) {
  const next = new Set(pendingTaskIds);
  const key = String(id);
  if (shouldAdd) next.add(key);
  else next.delete(key);
  return next;
}

export const useTasksStore = create((set, get) => ({
  tasks: [],
  loading: false,
  refreshing: false,
  error: "",
  pendingTaskIds: new Set(),
  activityLog: [],
  dashboard: null,
  dashboardLoading: false,

  addActivity: (entry) => {
    set((state) => ({
      activityLog: [entry, ...state.activityLog].slice(0, ACTIVITY_LIMIT)
    }));
  },

  fetchTasks: async (options = {}) => {
    const background = Boolean(options.background);
    const silent = Boolean(options.silent);
    set(background ? { refreshing: true } : { loading: true, error: "" });
    try {
      const data = await tasksApi.fetchTasks();
      const incoming = normalizeList(data);
      set((state) => ({
        tasks: reconcileTasks(state.tasks, incoming),
        error: ""
      }));
    } catch (err) {
      const msg = getApiErrorMessage(err);
      set({ error: msg });
      if (!silent) toast.error(msg);
      throw err;
    } finally {
      set(background ? { refreshing: false } : { loading: false });
    }
  },

  fetchDashboard: async () => {
    set({ dashboardLoading: true });
    try {
      const data = await tasksApi.fetchDashboard();
      set({ dashboard: data });
    } catch {
      set({ dashboard: null });
    } finally {
      set({ dashboardLoading: false });
    }
  },

  createTask: async (payload) => {
    const tempId = `tmp_${Date.now()}`;
    const optimistic = normalizeTask({ id: tempId, ...payload });
    const snapshot = get().tasks;
    set((state) => ({
      tasks: [optimistic, ...state.tasks],
      pendingTaskIds: withPendingId(state.pendingTaskIds, tempId, true)
    }));
    try {
      const created = normalizeTask(await tasksApi.createTask(payload));
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === tempId ? created : task)),
        pendingTaskIds: withPendingId(state.pendingTaskIds, tempId, false),
        activityLog: [activity("created", created), ...state.activityLog].slice(0, ACTIVITY_LIMIT)
      }));
      toast.success("Task created.");
      return created;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      set((state) => ({
        tasks: snapshot,
        pendingTaskIds: withPendingId(state.pendingTaskIds, tempId, false)
      }));
      toast.error(msg);
      throw err;
    }
  },

  updateTask: async (id, patch, options) => {
    const idKey = String(id);
    const prev = get().tasks.find((task) => String(task.id) === idKey);
    if (!prev) return null;
    const snapshot = get().tasks;
    const next = { ...prev, ...patch };
    set((state) => ({
      tasks: state.tasks.map((task) => (String(task.id) === idKey ? next : task)),
      pendingTaskIds: withPendingId(state.pendingTaskIds, id, true)
    }));
    try {
      const updated = normalizeTask(await tasksApi.updateTask(id, patch));
      const type = patch.status && patch.status !== prev.status ? "status" : "updated";
      set((state) => ({
        tasks: state.tasks.map((task) => (String(task.id) === idKey ? updated : task)),
        pendingTaskIds: withPendingId(state.pendingTaskIds, id, false),
        activityLog: [
          activity(type, updated, {
            fromStatus: type === "status" ? prev.status : undefined,
            toStatus: type === "status" ? updated.status : undefined
          }),
          ...state.activityLog
        ].slice(0, ACTIVITY_LIMIT)
      }));
      if (!options?.silent) toast.success("Task updated.");
      return updated;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      set((state) => ({
        tasks: snapshot,
        pendingTaskIds: withPendingId(state.pendingTaskIds, id, false)
      }));
      toast.error(msg);
      throw err;
    }
  },

  deleteTask: async (id) => {
    const idKey = String(id);
    const prev = get().tasks;
    const removed = prev.find((task) => String(task.id) === idKey);
    set((state) => ({
      tasks: state.tasks.filter((task) => String(task.id) !== idKey),
      pendingTaskIds: withPendingId(state.pendingTaskIds, id, true)
    }));
    try {
      await tasksApi.deleteTask(id);
      set((state) => ({
        pendingTaskIds: withPendingId(state.pendingTaskIds, id, false),
        activityLog: [activity("deleted", removed), ...state.activityLog].slice(0, ACTIVITY_LIMIT)
      }));
      toast.success("Task deleted.");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      set((state) => ({
        tasks: prev,
        pendingTaskIds: withPendingId(state.pendingTaskIds, id, false)
      }));
      toast.error(msg);
      throw err;
    }
  }
}));

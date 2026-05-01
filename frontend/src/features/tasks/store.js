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

export const useTasksStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: "",
  dashboard: null,
  dashboardLoading: false,

  fetchTasks: async () => {
    set({ loading: true, error: "" });
    try {
      const data = await tasksApi.fetchTasks();
      set({ tasks: normalizeList(data) });
    } catch (err) {
      const msg = getApiErrorMessage(err);
      set({ error: msg });
      throw err;
    } finally {
      set({ loading: false });
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
    set((s) => ({ tasks: [optimistic, ...s.tasks] }));
    try {
      const created = normalizeTask(await tasksApi.createTask(payload));
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === tempId ? created : t)) }));
      toast.success("Task created.");
      return created;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== tempId) }));
      toast.error(msg);
      throw err;
    }
  },

  updateTask: async (id, patch, options) => {
    const prev = get().tasks.find((t) => t.id === id);
    if (!prev) return null;
    const next = { ...prev, ...patch };
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? next : t)) }));
    try {
      const updated = normalizeTask(await tasksApi.updateTask(id, patch));
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }));
      if (!options?.silent) toast.success("Task updated.");
      return updated;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? prev : t)) }));
      toast.error(msg);
      throw err;
    }
  },

  deleteTask: async (id) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    try {
      await tasksApi.deleteTask(id);
      toast.success("Task deleted.");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      set({ tasks: prev });
      toast.error(msg);
      throw err;
    }
  }
}));

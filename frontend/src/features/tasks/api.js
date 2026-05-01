import { api } from "../../services/api.js";

function cleanPayload(payload) {
  const p = payload ?? {};
  return Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined && v !== null));
}

export async function fetchTasks() {
  const res = await api.get("/api/tasks");
  return res.data;
}

export async function fetchDashboard() {
  const res = await api.get("/api/tasks/dashboard");
  return res.data;
}

export async function createTask(payload) {
  const res = await api.post("/api/tasks", cleanPayload(payload));
  return res.data;
}

export async function updateTask(id, payload) {
  const res = await api.put(`/api/tasks/${encodeURIComponent(id)}`, cleanPayload(payload));
  return res.data;
}

export async function deleteTask(id) {
  await api.delete(`/api/tasks/${encodeURIComponent(id)}`);
}

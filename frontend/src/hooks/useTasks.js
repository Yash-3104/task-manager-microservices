import { useTasksStore } from "../features/tasks/store.js";

export function useTasks(selector) {
  return useTasksStore(selector);
}


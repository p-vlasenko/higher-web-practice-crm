import type { Task } from '../types/task';

export function isOverdue(task: Task, now = new Date()) {
  return Boolean(
    task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed',
  );
}

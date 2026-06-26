import type { DealStatus } from '../../types/deal';
import type { TaskStatus } from '../../types/task';

export type StatusTone =
  | 'new'
  | 'inProgress'
  | 'completed'
  | 'cancelled'
  | 'danger';

const toneByDealStatus: Record<DealStatus, StatusTone> = {
  new: 'new',
  in_progress: 'inProgress',
  completed: 'completed',
  cancelled: 'cancelled',
};

const toneByTaskStatus: Record<TaskStatus, StatusTone> = {
  new: 'new',
  in_progress: 'inProgress',
  completed: 'completed',
};

export function getDealStatusTone(status: DealStatus) {
  return toneByDealStatus[status];
}

export function getTaskStatusTone(status: TaskStatus) {
  return toneByTaskStatus[status];
}

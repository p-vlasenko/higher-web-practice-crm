import { cx } from 'classix';

import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  getDealStatusTone,
  getTaskStatusTone,
} from '../../components/ui/statusTones';
import type { Client } from '../../types/client';
import type { DealStatus } from '../../types/deal';
import type { Task } from '../../types/task';
import type { TaskStatus } from '../../types/task';
import {
  dealStatusLabels,
  formatCurrency,
  formatDate,
  taskStatusLabels,
} from '../../utils/formatters';
import type { DealTableRow } from '../../utils/relationReadModels';
import classes from '../../pages/Page.module.css';

type ClientSummaryCardProps = {
  client: Client;
  dealCount: number;
};

export function ClientSummaryCard({
  client,
  dealCount,
}: ClientSummaryCardProps) {
  return (
    <article className={classes.clientSummaryCard}>
      <div>
        <h3 className={classes.cardTitle}>{client.name}</h3>
        <p className={classes.cardMeta}>{client.company}</p>
      </div>
      <p className={classes.clientDealSummary}>
        <span>{dealCount}</span>
        <span>сделок</span>
      </p>
    </article>
  );
}

export function MobileClientSummaryCard({
  client,
  dealCount,
}: ClientSummaryCardProps) {
  return (
    <article className={classes.mobileClientCard}>
      <div>
        <h3 className={classes.mobileCardTitle}>{client.name}</h3>
        <p className={classes.mobileCardMeta}>{client.company}</p>
      </div>
      <p className={classes.mobileClientDealSummary}>
        <span>{dealCount}</span>
        <span>сделок</span>
      </p>
    </article>
  );
}

type DealSummaryCardProps = {
  deal: DealTableRow;
};

const surfaceClassByDealStatus: Record<DealStatus, string> = {
  new: classes.statusSurfaceNew,
  in_progress: classes.statusSurfaceInProgress,
  completed: classes.statusSurfaceCompleted,
  cancelled: classes.statusSurfaceCancelled,
};

const surfaceClassByTaskStatus: Record<TaskStatus, string> = {
  new: classes.statusSurfaceNew,
  in_progress: classes.statusSurfaceInProgress,
  completed: classes.statusSurfaceCompleted,
};

export function DealSummaryRow({ deal }: DealSummaryCardProps) {
  return (
    <article
      className={cx(
        classes.dealPreviewRow,
        surfaceClassByDealStatus[deal.status],
      )}
    >
      <span className={classes.dealTitle}>{deal.title}</span>
      <span className={classes.dealMeta}>{deal.clientName}</span>
      <span className={classes.dealAmount}>{formatCurrency(deal.amount)}</span>
      <StatusBadge
        className={classes.dealStatus}
        tone={getDealStatusTone(deal.status)}
      >
        {dealStatusLabels[deal.status]}
      </StatusBadge>
      <span className={classes.dealMeta}>{formatDate(deal.createdAt)}</span>
    </article>
  );
}

export function MobileDealSummaryCard({ deal }: DealSummaryCardProps) {
  return (
    <article
      className={cx(
        classes.mobileDealCard,
        surfaceClassByDealStatus[deal.status],
      )}
    >
      <h3 className={classes.mobileCardTitle}>{deal.title}</h3>
      <p className={classes.mobileCardMeta}>{deal.clientName}</p>
      <p className={classes.mobileDealAmount}>{formatCurrency(deal.amount)}</p>
      <p className={classes.mobileDealMetaRow}>
        <StatusBadge
          className={classes.mobileDealStatus}
          tone={getDealStatusTone(deal.status)}
        >
          {dealStatusLabels[deal.status]}
        </StatusBadge>
        <span className={classes.mobileCardMeta}>
          {formatDate(deal.createdAt)}
        </span>
      </p>
    </article>
  );
}

type TaskSummaryCardProps = {
  getDealTitle: (dealId?: string) => string;
  task: Task;
};

export function TaskSummaryCard({ getDealTitle, task }: TaskSummaryCardProps) {
  return (
    <article
      className={cx(
        classes.taskPreviewCard,
        surfaceClassByTaskStatus[task.status],
      )}
    >
      <h3 className={classes.cardTitle}>{task.title}</h3>
      <p className={classes.taskType}>сделка</p>
      <p className={classes.cardMeta}>{getDealTitle(task.dealId)}</p>
      <p className={classes.cardMeta}>{formatDate(task.dueDate)}</p>
      <StatusBadge
        className={classes.taskStatus}
        tone={getTaskStatusTone(task.status)}
      >
        {taskStatusLabels[task.status]}
      </StatusBadge>
    </article>
  );
}

export function MobileTaskSummaryCard({
  getDealTitle,
  task,
}: TaskSummaryCardProps) {
  return (
    <article
      className={cx(
        classes.mobileTaskCard,
        surfaceClassByTaskStatus[task.status],
      )}
    >
      <h3 className={classes.mobileTaskTitle}>{task.title}</h3>
      <p className={classes.mobileTaskType}>сделка</p>
      <p className={classes.mobileCardMeta}>{getDealTitle(task.dealId)}</p>
      <p className={classes.mobileTaskFooter}>
        <span className={classes.mobileTaskDeadline}>
          {formatDate(task.dueDate)}
        </span>
        <StatusBadge
          className={classes.mobileTaskStatus}
          tone={getTaskStatusTone(task.status)}
        >
          {taskStatusLabels[task.status]}
        </StatusBadge>
      </p>
    </article>
  );
}

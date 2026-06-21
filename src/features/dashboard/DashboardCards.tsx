import type { Client } from '../../types/client';
import type { Task } from '../../types/task';
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

export function DealSummaryRow({ deal }: DealSummaryCardProps) {
  return (
    <article className={classes.dealPreviewRow}>
      <span className={classes.dealTitle}>{deal.title}</span>
      <span className={classes.dealMeta}>{deal.clientName}</span>
      <span className={classes.dealAmount}>{formatCurrency(deal.amount)}</span>
      <span className={classes.dealStatus}>
        {dealStatusLabels[deal.status]}
      </span>
      <span className={classes.dealMeta}>{formatDate(deal.createdAt)}</span>
    </article>
  );
}

export function MobileDealSummaryCard({ deal }: DealSummaryCardProps) {
  return (
    <article className={classes.mobileDealCard}>
      <h3 className={classes.mobileCardTitle}>{deal.title}</h3>
      <p className={classes.mobileCardMeta}>{deal.clientName}</p>
      <p className={classes.mobileDealAmount}>{formatCurrency(deal.amount)}</p>
      <p className={classes.mobileDealMetaRow}>
        <span className={classes.mobileDealStatus}>
          {dealStatusLabels[deal.status]}
        </span>
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
    <article className={classes.taskPreviewCard}>
      <h3 className={classes.cardTitle}>{task.title}</h3>
      <p className={classes.taskType}>сделка</p>
      <p className={classes.cardMeta}>{getDealTitle(task.dealId)}</p>
      <p className={classes.cardMeta}>{formatDate(task.dueDate)}</p>
      <p className={classes.taskStatus}>{taskStatusLabels[task.status]}</p>
    </article>
  );
}

export function MobileTaskSummaryCard({
  getDealTitle,
  task,
}: TaskSummaryCardProps) {
  return (
    <article className={classes.mobileTaskCard}>
      <h3 className={classes.mobileTaskTitle}>{task.title}</h3>
      <p className={classes.mobileTaskType}>сделка</p>
      <p className={classes.mobileCardMeta}>{getDealTitle(task.dealId)}</p>
      <p className={classes.mobileTaskFooter}>
        <span className={classes.mobileTaskDeadline}>
          {formatDate(task.dueDate)}
        </span>
        <span className={classes.mobileTaskStatus}>
          {taskStatusLabels[task.status]}
        </span>
      </p>
    </article>
  );
}

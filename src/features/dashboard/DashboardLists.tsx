import { cx } from 'classix';

import type { Client } from '../../types/client';
import type { Deal } from '../../types/deal';
import type { Task } from '../../types/task';
import { createDealTableRows } from '../../utils/relationReadModels';
import classes from '../../pages/Page.module.css';
import {
  ClientSummaryCard,
  DealSummaryRow,
  MobileClientSummaryCard,
  MobileDealSummaryCard,
  MobileTaskSummaryCard,
  TaskSummaryCard,
} from './DashboardCards';

type TopClientsListProps = {
  clients: Client[];
  dealCountByClientId: Record<string, number>;
  mobile?: boolean;
};

export function TopClientsList({
  clients,
  dealCountByClientId,
  mobile = false,
}: TopClientsListProps) {
  if (!clients.length) {
    return (
      <p className={classes.dashboardEmpty}>Нет клиентов для отображения.</p>
    );
  }

  const Card = mobile ? MobileClientSummaryCard : ClientSummaryCard;

  return (
    <div
      className={cx(
        mobile && classes.mobileDashboardList,
        !mobile && classes.clientCardGrid,
      )}
    >
      {clients.map((client) => (
        <Card
          client={client}
          dealCount={dealCountByClientId[client.id] ?? 0}
          key={client.id}
        />
      ))}
    </div>
  );
}

type TopDealsListProps = {
  clients: Client[];
  deals: Deal[];
  mobile?: boolean;
};

export function TopDealsList({
  clients,
  deals,
  mobile = false,
}: TopDealsListProps) {
  if (!deals.length) {
    return (
      <p className={classes.dashboardEmpty}>
        Нет активных сделок для отображения.
      </p>
    );
  }

  const dealRows = createDealTableRows(deals, clients);

  if (mobile) {
    return (
      <div className={classes.mobileDashboardList}>
        {dealRows.map((deal) => (
          <MobileDealSummaryCard deal={deal} key={deal.id} />
        ))}
      </div>
    );
  }

  return (
    <div className={classes.dealList}>
      {dealRows.map((deal) => (
        <DealSummaryRow deal={deal} key={deal.id} />
      ))}
    </div>
  );
}

type RecentTasksListProps = {
  getDealTitle: (dealId?: string) => string;
  mobile?: boolean;
  tasks: Task[];
};

export function RecentTasksList({
  getDealTitle,
  mobile = false,
  tasks,
}: RecentTasksListProps) {
  if (!tasks.length) {
    return <p className={classes.dashboardEmpty}>Нет задач для отображения.</p>;
  }

  if (mobile) {
    return (
      <div className={classes.mobileDashboardList}>
        {tasks.map((task) => (
          <MobileTaskSummaryCard
            getDealTitle={getDealTitle}
            key={task.id}
            task={task}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={classes.taskCardGrid}>
      {tasks.map((task) => (
        <TaskSummaryCard
          getDealTitle={getDealTitle}
          key={task.id}
          task={task}
        />
      ))}
    </div>
  );
}

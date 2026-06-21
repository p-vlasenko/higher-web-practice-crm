import type { DashboardResponse } from '../../types/dashboard';
import classes from '../../pages/Page.module.css';
import { DashboardMetricRow } from './DashboardMetrics';
import { DashboardSection } from './DashboardSection';
import {
  RecentTasksList,
  TopClientsList,
  TopDealsList,
} from './DashboardLists';

type DashboardDesktopViewProps = {
  dashboard: DashboardResponse;
  firstName: string;
  getDealTitle: (dealId?: string) => string;
  onCreateClient: () => void;
  onCreateDeal: () => void;
  onCreateTask: () => void;
};

export function DashboardDesktopView({
  dashboard,
  firstName,
  getDealTitle,
  onCreateClient,
  onCreateDeal,
  onCreateTask,
}: DashboardDesktopViewProps) {
  return (
    <div className={classes.desktopDashboardContent}>
      <header className={classes.welcomeHeader}>
        <h1 className={classes.welcomeTitle}>Добро пожаловать, {firstName}!</h1>
        <p className={classes.welcomeSubtitle}>
          Посмотрите сводную информацию по вашим клиентам, сделкам и задачам
        </p>
      </header>

      <div className={classes.metricsTable} aria-label='Сводные показатели'>
        <div className={classes.metricsHeaderRow}>
          <span />
          <span>на сегодня</span>
          <span>за сегодня</span>
          <span>за неделю</span>
          <span>за месяц</span>
          <span>за квартал</span>
        </div>
        <DashboardMetricRow
          label='Клиенты'
          total={dashboard.stats.clients.total}
          today={dashboard.stats.clients.today}
          week={dashboard.stats.clients.week}
          month={dashboard.stats.clients.month}
          quarter={dashboard.stats.clients.quarter}
        />
        <DashboardMetricRow
          label='Активные сделки'
          total={dashboard.stats.activeDeals.total}
          today={dashboard.stats.activeDeals.today}
          week={dashboard.stats.activeDeals.week}
          month={dashboard.stats.activeDeals.month}
          quarter={dashboard.activeDealsQuarter}
        />
        <DashboardMetricRow
          label='Завершённые сделки'
          total={dashboard.stats.completedDeals.total}
          today={dashboard.stats.completedDeals.today}
          week={dashboard.stats.completedDeals.week}
          month={dashboard.stats.completedDeals.month}
          quarter={dashboard.completedQuarter}
        />
      </div>

      <DashboardSection
        title='Топ 10 активных клиентов'
        buttonLabel='Новый клиент'
        onAction={onCreateClient}
      >
        <TopClientsList
          clients={dashboard.topClients}
          dealCountByClientId={dashboard.dealCountByClientId}
        />
      </DashboardSection>

      <DashboardSection
        title='Топ 10 активных сделок'
        buttonLabel='Новая сделка'
        onAction={onCreateDeal}
        disabled={dashboard.activeClients.length === 0}
      >
        <TopDealsList
          clients={dashboard.clients}
          deals={dashboard.topActiveDeals}
        />
      </DashboardSection>

      <DashboardSection
        title='Последние 10 задач'
        buttonLabel='Новая задача'
        onAction={onCreateTask}
        disabled={dashboard.deals.length === 0}
      >
        <RecentTasksList
          tasks={dashboard.recentTasks}
          getDealTitle={getDealTitle}
        />
      </DashboardSection>
    </div>
  );
}

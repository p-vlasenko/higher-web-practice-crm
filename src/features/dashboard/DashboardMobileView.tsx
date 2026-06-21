import { cx } from 'classix';

import type { DashboardResponse } from '../../types/dashboard';
import classes from '../../pages/Page.module.css';
import {
  RecentTasksList,
  TopClientsList,
  TopDealsList,
} from './DashboardLists';
import { MobileMetricCard } from './DashboardMetrics';
import { MobileDashboardSection } from './DashboardSection';
import { mobileDashboardTabs, type MobileDashboardTab } from './dashboardTypes';

type DashboardMobileViewProps = {
  dashboard: DashboardResponse;
  firstName: string;
  getDealTitle: (dealId?: string) => string;
  mobileTab: MobileDashboardTab;
  onCreateClient: () => void;
  onCreateDeal: () => void;
  onCreateTask: () => void;
  onTabChange: (tab: MobileDashboardTab) => void;
};

export function DashboardMobileView({
  dashboard,
  firstName,
  getDealTitle,
  mobileTab,
  onCreateClient,
  onCreateDeal,
  onCreateTask,
  onTabChange,
}: DashboardMobileViewProps) {
  return (
    <div className={classes.mobileDashboardContent}>
      <header className={classes.welcomeHeader}>
        <h1 className={classes.welcomeTitle}>Добро пожаловать, {firstName}!</h1>
        <p className={classes.welcomeSubtitle}>
          Посмотрите сводную информацию по вашим клиентам, сделкам и задачам
        </p>
      </header>
      <div
        className={classes.mobileDashboardTabs}
        role='tablist'
        aria-label='Разделы главной'
      >
        {mobileDashboardTabs.map((tab) => (
          <button
            aria-selected={mobileTab === tab.value}
            className={cx(
              classes.mobileDashboardTab,
              mobileTab === tab.value && classes.mobileDashboardTabActive,
            )}
            key={tab.value}
            role='tab'
            type='button'
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mobileTab === 'main' ? (
        <div
          className={classes.mobileMetricList}
          aria-label='Сводные показатели'
        >
          <MobileMetricCard
            label='Клиенты'
            total={dashboard.stats.clients.total}
            today={dashboard.stats.clients.today}
            week={dashboard.stats.clients.week}
            month={dashboard.stats.clients.month}
            quarter={dashboard.stats.clients.quarter}
          />
          <MobileMetricCard
            label='Активные сделки'
            total={dashboard.stats.activeDeals.total}
            today={dashboard.stats.activeDeals.today}
            week={dashboard.stats.activeDeals.week}
            month={dashboard.stats.activeDeals.month}
            quarter={dashboard.activeDealsQuarter}
          />
          <MobileMetricCard
            label='Завершённые сделки'
            total={dashboard.stats.completedDeals.total}
            today={dashboard.stats.completedDeals.today}
            week={dashboard.stats.completedDeals.week}
            month={dashboard.stats.completedDeals.month}
            quarter={dashboard.completedQuarter}
          />
        </div>
      ) : null}

      {mobileTab === 'clients' ? (
        <MobileDashboardSection
          title='Топ 10 активных клиентов'
          buttonLabel='Новый клиент'
          onAction={onCreateClient}
        >
          <TopClientsList
            clients={dashboard.topClients}
            dealCountByClientId={dashboard.dealCountByClientId}
            mobile
          />
        </MobileDashboardSection>
      ) : null}

      {mobileTab === 'deals' ? (
        <MobileDashboardSection
          title='Топ 10 активных сделок'
          buttonLabel='Новая сделка'
          disabled={dashboard.activeClients.length === 0}
          onAction={onCreateDeal}
        >
          <TopDealsList
            clients={dashboard.clients}
            deals={dashboard.topActiveDeals}
            mobile
          />
        </MobileDashboardSection>
      ) : null}

      {mobileTab === 'tasks' ? (
        <MobileDashboardSection
          title='Последние 10 задач'
          buttonLabel='Новая задача'
          disabled={dashboard.deals.length === 0}
          onAction={onCreateTask}
        >
          <RecentTasksList
            tasks={dashboard.recentTasks}
            getDealTitle={getDealTitle}
            mobile
          />
        </MobileDashboardSection>
      ) : null}
    </div>
  );
}

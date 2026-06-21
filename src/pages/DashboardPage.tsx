import { useState } from 'react';

import {
  useCreateClientMutation,
  useCreateDealMutation,
  useCreateTaskMutation,
  useGetDashboardQuery,
  useGetUsersQuery,
} from '../api/endpoints/crmEndpoints';
import { useAppSelector } from '../app/hooks';
import { DashboardDesktopView } from '../features/dashboard/DashboardDesktopView';
import { DashboardMobileView } from '../features/dashboard/DashboardMobileView';
import { DashboardModals } from '../features/dashboard/DashboardModals';
import { defaultDashboard } from '../features/dashboard/dashboardDefaults';
import type { MobileDashboardTab } from '../features/dashboard/dashboardTypes';
import classes from './Page.module.css';

export function DashboardPage() {
  const currentUser = useAppSelector((state) => state.session.user);
  const userId = currentUser?.id ?? null;
  const { data: dashboard = defaultDashboard } = useGetDashboardQuery({
    userId: userId ?? undefined,
  });

  const { data: users = [] } = useGetUsersQuery();

  const [createClient, createClientState] = useCreateClientMutation();
  const [createDeal, createDealState] = useCreateDealMutation();
  const [createTask, createTaskState] = useCreateTaskMutation();

  const [clientModalOpened, setClientModalOpened] = useState(false);
  const [dealModalOpened, setDealModalOpened] = useState(false);
  const [taskModalOpened, setTaskModalOpened] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileDashboardTab>('main');

  const firstName = currentUser?.name.split(' ')[0] ?? 'Ярополк';
  const getDealTitle = (dealId?: string) =>
    (dealId ? dashboard.dealTitleById[dealId] : undefined) ?? 'Без сделки';

  return (
    <section className={classes.dashboardPage}>
      <DashboardDesktopView
        dashboard={dashboard}
        firstName={firstName}
        getDealTitle={getDealTitle}
        onCreateClient={() => setClientModalOpened(true)}
        onCreateDeal={() => setDealModalOpened(true)}
        onCreateTask={() => setTaskModalOpened(true)}
      />

      <DashboardMobileView
        dashboard={dashboard}
        firstName={firstName}
        getDealTitle={getDealTitle}
        mobileTab={mobileTab}
        onCreateClient={() => setClientModalOpened(true)}
        onCreateDeal={() => setDealModalOpened(true)}
        onCreateTask={() => setTaskModalOpened(true)}
        onTabChange={setMobileTab}
      />

      <DashboardModals
        activeClients={dashboard.activeClients}
        clientLoading={createClientState.isLoading}
        clientModalOpened={clientModalOpened}
        createClient={createClient}
        createDeal={createDeal}
        createTask={createTask}
        dealLoading={createDealState.isLoading}
        dealModalOpened={dealModalOpened}
        deals={dashboard.deals}
        setClientModalOpened={setClientModalOpened}
        setDealModalOpened={setDealModalOpened}
        setTaskModalOpened={setTaskModalOpened}
        taskLoading={createTaskState.isLoading}
        taskModalOpened={taskModalOpened}
        userId={userId}
        users={users}
      />
    </section>
  );
}

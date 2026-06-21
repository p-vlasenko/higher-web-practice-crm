import { ClientModal } from '../clients/ClientModal';
import { toClientPayload } from '../clients/clientService';
import { DealModal } from '../deals/DealModal';
import { toDealPayload } from '../deals/dealService';
import { TaskModal } from '../tasks/TaskModal';
import { toTaskPayload } from '../tasks/taskService';
import type { Client } from '../../types/client';
import type { Deal } from '../../types/deal';
import type { User } from '../../types/user';
import {
  createClientOptions,
  createDealOptions,
  createUserOptions,
} from '../../utils/optionReadModels';

type DashboardModalsProps = {
  activeClients: Client[];
  clientLoading: boolean;
  clientModalOpened: boolean;
  createClient: (
    payload: ReturnType<typeof toClientPayload>,
  ) => Promise<unknown>;
  createDeal: (payload: ReturnType<typeof toDealPayload>) => Promise<unknown>;
  createTask: (payload: ReturnType<typeof toTaskPayload>) => Promise<unknown>;
  dealLoading: boolean;
  dealModalOpened: boolean;
  deals: Deal[];
  setClientModalOpened: (opened: boolean) => void;
  setDealModalOpened: (opened: boolean) => void;
  setTaskModalOpened: (opened: boolean) => void;
  taskLoading: boolean;
  taskModalOpened: boolean;
  userId: string | null | undefined;
  users: User[];
};

export function DashboardModals({
  activeClients,
  clientLoading,
  clientModalOpened,
  createClient,
  createDeal,
  createTask,
  dealLoading,
  dealModalOpened,
  deals,
  setClientModalOpened,
  setDealModalOpened,
  setTaskModalOpened,
  taskLoading,
  taskModalOpened,
  userId,
  users,
}: DashboardModalsProps) {
  return (
    <>
      <ClientModal
        opened={clientModalOpened}
        client={null}
        loading={clientLoading}
        onClose={() => setClientModalOpened(false)}
        onSubmit={async (values) => {
          if (!userId) return;

          await createClient(toClientPayload(values, userId));

          setClientModalOpened(false);
        }}
      />
      <DealModal
        opened={dealModalOpened}
        deal={null}
        clientOptions={createClientOptions(activeClients)}
        loading={dealLoading}
        onClose={() => setDealModalOpened(false)}
        onSubmit={async (values) => {
          if (!userId) return;

          await createDeal(toDealPayload(values, userId));

          setDealModalOpened(false);
        }}
      />
      {userId ? (
        <TaskModal
          opened={taskModalOpened}
          task={null}
          assigneeOptions={createUserOptions(users)}
          currentUserId={userId}
          dealOptions={createDealOptions(deals)}
          loading={taskLoading}
          onClose={() => setTaskModalOpened(false)}
          onSubmit={async (values) => {
            await createTask(toTaskPayload(values, userId));
            
            setTaskModalOpened(false);
          }}
        />
      ) : null}
    </>
  );
}

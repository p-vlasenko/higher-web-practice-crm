export type MobileDashboardTab = 'main' | 'clients' | 'deals' | 'tasks';

export const mobileDashboardTabs: {
  value: MobileDashboardTab;
  label: string;
}[] = [
  { value: 'main', label: 'Главная' },
  { value: 'clients', label: 'Клиенты' },
  { value: 'deals', label: 'Сделки' },
  { value: 'tasks', label: 'Задачи' },
];

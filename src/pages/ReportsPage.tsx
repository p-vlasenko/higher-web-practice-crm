import { useAppSelector } from '../app/hooks';
import { ReportsDashboard } from '../features/reports/ReportsDashboard';
import classes from './ReportsPage.module.css';

export function ReportsPage() {
  const userId = useAppSelector((state) => state.session.user?.id ?? null);

  return (
    <section className={classes.reportsPage}>
      <h1 className={classes.reportsTitle}>Отчёты</h1>
      <div className={classes.reportsStack}>
        <ReportsDashboard userId={userId ?? undefined} />
      </div>
    </section>
  );
}

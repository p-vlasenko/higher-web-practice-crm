import classes from '../../pages/Page.module.css';

export type DashboardMetricProps = {
  label: string;
  total: number;
  today: number;
  week: number;
  month: number;
  quarter: number;
};

export function DashboardMetricRow({
  label,
  total,
  today,
  week,
  month,
  quarter,
}: DashboardMetricProps) {
  return (
    <div className={classes.metricRow}>
      <span className={classes.metricLabel}>{label}</span>
      <span className={classes.metricMainValue}>{total}</span>
      <span className={classes.metricDelta}>+{today}</span>
      <span className={classes.metricDelta}>+{week}</span>
      <span className={classes.metricDelta}>+{month}</span>
      <span className={classes.metricDelta}>+{quarter}</span>
    </div>
  );
}

export function MobileMetricCard({
  label,
  total,
  today,
  week,
  month,
  quarter,
}: DashboardMetricProps) {
  return (
    <article className={classes.mobileMetricCard}>
      <h2 className={classes.mobileMetricTitle}>{label}</h2>
      <div className={classes.mobileMetricGrid}>
        <div className={classes.mobileCurrentMetric}>
          <span>{total}</span>
          <span>на сегодня</span>
        </div>
        <div className={classes.mobileDeltaColumn}>
          <p className={classes.mobileDeltaRow}>
            <span>за сегодня</span>
            <strong>+{today}</strong>
          </p>
          <p className={classes.mobileDeltaRow}>
            <span>за неделю</span>
            <strong>+{week}</strong>
          </p>
        </div>
        <div className={classes.mobileDeltaColumn}>
          <p className={classes.mobileDeltaRow}>
            <span>за месяц</span>
            <strong>+{month}</strong>
          </p>
          <p className={classes.mobileDeltaRow}>
            <span>за квартал</span>
            <strong>+{quarter}</strong>
          </p>
        </div>
      </div>
    </article>
  );
}

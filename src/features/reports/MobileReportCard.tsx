import classes from '../../pages/ReportsPage.module.css';
import type { ReportCardVariant, ReportTableRow } from './reportTypes';

type MobileReportCardProps = {
  row: ReportTableRow;
  variant: ReportCardVariant;
};

export function MobileReportCard({ row, variant }: MobileReportCardProps) {
  const [id, first, second, third, fourth] = row.cells;

  if (variant === 'salesSummary') {
    return (
      <span
        className={`${classes.mobileReportCard} ${classes.mobileSalesCard}`}
      >
        <span className={classes.mobileCardTopRow}>
          <span className={classes.mobileCardId}>{id}</span>
          <span>{second}</span>
          <span
            className={`${classes.mobileCardTitle} ${classes.mobileSalesTitle}`}
          >
            {first}
          </span>
        </span>
        <span className={classes.mobileCardBottomRow}>
          <span className={classes.mobileCardAmount}>{third}</span>
          <span className={classes.mobileCardDate}>{fourth}</span>
        </span>
      </span>
    );
  }

  if (variant === 'dealStages') {
    return (
      <span
        className={`${classes.mobileReportCard} ${classes.mobileStageCard}`}
      >
        <span className={classes.mobileStageName}>{id}</span>
        <span className={classes.mobileCardAmount}>{second}</span>
        <span>{first} сделок</span>
      </span>
    );
  }

  if (variant === 'newClients') {
    return (
      <span
        className={`${classes.mobileReportCard} ${classes.mobileClientCard}`}
      >
        <span className={classes.mobileCardTopRow}>
          <span className={classes.mobileInlineGroup}>
            <span className={classes.mobileCardLabel}>id</span>
            <span className={classes.mobileCardId}>{id}</span>
          </span>
          <span
            className={`${classes.mobileInlineGroup} ${classes.mobileClientNameGroup}`}
          >
            <span className={classes.mobileCardLabel}>Клиент</span>
            <span className={classes.mobileCardTitle}>{first}</span>
          </span>
        </span>
        <span className={classes.mobileCardBottomRow}>
          <span className={classes.mobileCardTitle}>{second}</span>
          <span className={classes.mobileCardDate}>{third}</span>
        </span>
      </span>
    );
  }

  if (variant === 'clientActivity') {
    return (
      <span
        className={`${classes.mobileReportCard} ${classes.mobileActivityCard}`}
      >
        <span className={classes.mobileInlineGroup}>
          <span className={classes.mobileCardLabel}>id</span>
          <span className={classes.mobileCardId}>{id}</span>
        </span>
        <span className={classes.mobileCardTitle}>{first}</span>
        <span className={classes.mobileMetricGroup}>
          <span>{second}</span>
          <span className={classes.mobileCardLabel}>сделок</span>
        </span>
        <span className={classes.mobileMetricGroup}>
          <span>{third}</span>
          <span className={classes.mobileCardLabel}>задач</span>
        </span>
      </span>
    );
  }

  return (
    <span className={`${classes.mobileReportCard} ${classes.mobileTaskCard}`}>
      <span className={classes.mobileTaskTopRow}>
        <span className={classes.mobileTaskId}>id {id}</span>
        <span className={classes.mobileTaskStatus}>{third}</span>
      </span>
      <span className={classes.mobileTaskTitle}>{first}</span>
      <span className={classes.mobileTaskMetaRow}>
        <span className={classes.mobileTaskAssigneeGroup}>
          <span>{second}</span>
          <span className={classes.mobileCardLabel}>Ответственный</span>
        </span>
        <span className={classes.mobileCardDate}>{fourth}</span>
      </span>
    </span>
  );
}

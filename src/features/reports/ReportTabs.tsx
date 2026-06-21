import classes from '../../pages/ReportsPage.module.css';
import { reportTabs } from './reportOptions';
import type { ReportTab } from './reportTypes';

type ReportTabsProps = {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
};

export function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  return (
    <div className={classes.tabs} role='tablist' aria-label='Разделы отчетов'>
      {reportTabs.map((tab) => (
        <button
          aria-selected={activeTab === tab.value}
          className={
            activeTab === tab.value
              ? `${classes.tab} ${classes.tabActive}`
              : classes.tab
          }
          key={tab.value}
          role='tab'
          type='button'
          onClick={() => onTabChange(tab.value)}
        >
          <span className={classes.desktopTabLabel}>{tab.label}</span>
          <span className={classes.mobileTabLabel}>{tab.mobileLabel}</span>
        </button>
      ))}
    </div>
  );
}

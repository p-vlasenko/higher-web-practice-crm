import { DealsController } from '../features/deals/DealsController';
import classes from './Page.module.css';

export function DealsPage() {
  return (
    <section className={classes.dealsPage}>
      <h1 className={classes.dealsTitle}>Сделки</h1>
      <DealsController />
    </section>
  );
}

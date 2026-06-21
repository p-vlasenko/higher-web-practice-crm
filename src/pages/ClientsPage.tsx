import { ClientsController } from '../features/clients/ClientsController';
import classes from './Page.module.css';

export function ClientsPage() {
  return (
    <section className={classes.clientsPage}>
      <h1 className={classes.clientsTitle}>Клиенты</h1>
      <ClientsController />
    </section>
  );
}

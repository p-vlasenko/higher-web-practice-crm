import { TasksController } from '../features/tasks/TasksController';
import classes from './Page.module.css';

export function TasksPage() {
  return (
    <section className={classes.tasksPage}>
      <h1 className={classes.tasksTitle}>Задачи</h1>
      <TasksController />
    </section>
  );
}

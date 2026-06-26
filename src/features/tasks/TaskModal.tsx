import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';

import {
  CrmSelect,
  CrmTextInput,
  CrmTextarea,
} from '../../components/ui/FormFields';
import { CrmModal } from '../../components/ui/Modal';
import modalClasses from '../../components/ui/ui.module.css';
import type { EntityOption } from '../../types/options';
import type { Task } from '../../types/task';
import { taskStatusLabels } from '../../utils/formatters';
import { taskSchema, type TaskFormValues } from './taskSchemas';

type TaskModalProps = {
  opened: boolean;
  task?: Task | null;
  assigneeOptions: EntityOption[];
  currentUserId: string;
  dealOptions: EntityOption[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<unknown> | void;
};

const getTaskFormValues = (
  task: Task | null | undefined,
  defaults: TaskFormValues,
): TaskFormValues =>
  task
    ? {
        ...task,
        dueDate: task.dueDate?.slice(0, 10) ?? '',
        description: task.description ?? '',
        dealId: task.dealId ?? '',
      }
    : defaults;

export function TaskModal({
  opened,
  task,
  assigneeOptions,
  currentUserId,
  dealOptions,
  loading,
  onClose,
  onSubmit,
}: TaskModalProps) {
  const defaults: TaskFormValues = useMemo(
    () => ({
      title: '',
      dealId: '',
      description: '',
      dueDate: '',
      assigneeId: currentUserId,
      status: 'new',
    }),
    [currentUserId],
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(getTaskFormValues(task, defaults));
  }, [task, reset, defaults]);

  const closeModal = () => {
    onClose();
  };

  const submitForm = handleSubmit(async (values) => {
    await onSubmit(values);

    if (!task) {
      reset(defaults);
    }
  });

  return (
    <CrmModal
      opened={opened}
      title={task ? 'Карточка задачи' : 'Новая задача'}
      hideCancelOnMobile={!task}
      loading={loading}
      mobileBackLabel={task ? undefined : 'Новая задача'}
      submitLabel={task ? 'Сохранить' : 'Создать задачу'}
      onClose={closeModal}
      onSubmit={submitForm}
    >
      <form className={modalClasses.modalForm} onSubmit={submitForm}>
        <div className={modalClasses.modalFieldRow}>
          <div className={modalClasses.modalField}>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <CrmTextInput
                  required
                  label='Название'
                  placeholder='Позвонить клиенту'
                  error={errors.title?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className={modalClasses.modalField}>
            <Controller
              name='dealId'
              control={control}
              render={({ field }) => (
                <CrmSelect
                  label='Сделка'
                  data={dealOptions}
                  placeholder='Заключение договора'
                  error={errors.dealId?.message}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className={modalClasses.modalFieldRow}>
          <div className={modalClasses.modalField}>
            <Controller
              name='assigneeId'
              control={control}
              render={({ field }) => (
                <CrmSelect
                  required
                  label='Исполнитель'
                  data={assigneeOptions}
                  error={errors.assigneeId?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className={modalClasses.modalField}>
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <CrmSelect
                  required
                  label='Статус'
                  data={Object.entries(taskStatusLabels).map(
                    ([value, label]) => ({ value, label }),
                  )}
                  error={errors.status?.message}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className={modalClasses.modalField}>
          <Controller
            name='dueDate'
            control={control}
            render={({ field }) => (
              <CrmTextInput
                type='date'
                label='Срок'
                error={errors.dueDate?.message}
                {...field}
              />
            )}
          />
        </div>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <CrmTextarea
              label='Описание'
              placeholder='Обсудить детали и следующий шаг.'
              error={errors.description?.message}
              {...field}
            />
          )}
        />
      </form>
    </CrmModal>
  );
}

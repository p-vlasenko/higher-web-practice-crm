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
  onSubmit: (values: TaskFormValues) => void;
};

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
    reset(
      task
        ? {
            ...task,
            dueDate: task.dueDate?.slice(0, 10) ?? '',
            description: task.description ?? '',
            dealId: task.dealId ?? '',
          }
        : defaults,
    );
  }, [task, reset, defaults]);

  return (
    <CrmModal
      opened={opened}
      title={task ? 'Карточка задачи' : 'Новая задача'}
      hideCancelOnMobile={!task}
      loading={loading}
      mobileBackLabel={task ? undefined : 'Новая задача'}
      submitLabel={task ? 'Сохранить' : 'Создать задачу'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <form
        className={modalClasses.modalForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={modalClasses.modalFieldRow}>
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <CrmTextInput
                label='Название'
                placeholder='Позвонить клиенту'
                error={errors.title?.message}
                {...field}
              />
            )}
          />
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
        <div className={modalClasses.modalFieldRow}>
          <Controller
            name='assigneeId'
            control={control}
            render={({ field }) => (
              <CrmSelect
                label='Исполнитель'
                data={assigneeOptions}
                error={errors.assigneeId?.message}
                {...field}
              />
            )}
          />
          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <CrmSelect
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

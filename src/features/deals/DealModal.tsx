import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useEffect } from 'react';

import {
  CrmNumberInput,
  CrmSelect,
  CrmTextInput,
  CrmTextarea,
} from '../../components/ui/FormFields';
import { CrmModal } from '../../components/ui/Modal';
import modalClasses from '../../components/ui/ui.module.css';
import type { Deal } from '../../types/deal';
import type { EntityOption } from '../../types/options';
import { dealStatusLabels } from '../../utils/formatters';
import { dealSchema, dealStatuses, type DealFormValues } from './dealSchemas';

type DealModalProps = {
  opened: boolean;
  deal?: Deal | null;
  clientOptions: EntityOption[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: DealFormValues) => Promise<unknown> | void;
};

const createDealDefaults = (): DealFormValues => ({
  title: '',
  clientId: '',
  description: '',
  amount: 0,
  status: 'new',
  createdAt: new Date().toISOString().slice(0, 10),
  completedAt: '',
});

const getDealFormValues = (deal?: Deal | null): DealFormValues =>
  deal
    ? {
        ...deal,
        createdAt: deal.createdAt.slice(0, 10),
        completedAt: deal.completedAt?.slice(0, 10) ?? '',
        description: deal.description ?? '',
      }
    : createDealDefaults();

function getNextDate(value?: string) {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  date.setDate(date.getDate() + 1);

  return date.toISOString().slice(0, 10);
}

export function DealModal({
  opened,
  deal,
  clientOptions,
  loading,
  onClose,
  onSubmit,
}: DealModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: createDealDefaults(),
  });
  const status = useWatch({ control, name: 'status' });
  const createdAt = useWatch({ control, name: 'createdAt' });
  const completionMinDate = getNextDate(createdAt);
  const isCompleted = status === 'completed';

  useEffect(() => {
    reset(getDealFormValues(deal));
  }, [deal, reset]);

  useEffect(() => {
    if (!isCompleted) {
      setValue('completedAt', '');
    }
  }, [isCompleted, setValue]);

  const closeModal = () => {
    onClose();
  };

  const submitForm = handleSubmit(async (values) => {
    await onSubmit(values);

    if (!deal) {
      reset(createDealDefaults());
    }
  });

  return (
    <CrmModal
      opened={opened}
      title={deal ? 'Карточка сделки' : 'Новая сделка'}
      hideCancelOnMobile={!deal}
      loading={loading}
      mobileBackLabel={deal ? undefined : 'Новая сделка'}
      submitLabel={deal ? 'Сохранить' : 'Создать сделку'}
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
                  placeholder='Заключение договора'
                  error={errors.title?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className={modalClasses.modalField}>
            <Controller
              name='clientId'
              control={control}
              render={({ field }) => (
                <CrmSelect
                  required
                  label='Клиент'
                  data={clientOptions}
                  placeholder='Велимир'
                  error={errors.clientId?.message}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className={modalClasses.modalFieldRow}>
          <div className={modalClasses.modalField}>
            <Controller
              name='amount'
              control={control}
              render={({ field }) => (
                <CrmNumberInput
                  required
                  label='Сумма'
                  placeholder='50 000 ₽'
                  error={errors.amount?.message}
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
                  data={dealStatuses.map((value) => ({
                    value,
                    label: dealStatusLabels[value],
                  }))}
                  error={errors.status?.message}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        {isCompleted ? (
          <div className={modalClasses.modalFieldRow}>
            <div className={modalClasses.modalField}>
              <Controller
                name='createdAt'
                control={control}
                render={({ field }) => (
                  <CrmTextInput
                    required
                    type='date'
                    label='Дата создания'
                    error={errors.createdAt?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className={modalClasses.modalField}>
              <Controller
                name='completedAt'
                control={control}
                render={({ field }) => (
                  <CrmTextInput
                    required
                    type='date'
                    label='Дата завершения'
                    min={completionMinDate}
                    error={errors.completedAt?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        ) : null}
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <CrmTextarea
              label='Описание'
              placeholder='Подготовка финальных условий для долгосрочного контракта.'
              error={errors.description?.message}
              {...field}
            />
          )}
        />
      </form>
    </CrmModal>
  );
}

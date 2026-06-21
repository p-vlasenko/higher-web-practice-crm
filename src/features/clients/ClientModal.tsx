import { Button } from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { CrmTextInput, CrmTextarea } from '../../components/ui/FormFields';
import { CrmModal } from '../../components/ui/Modal';
import modalClasses from '../../components/ui/ui.module.css';
import type { Client } from '../../types/client';
import { formatDate } from '../../utils/formatters';
import { clientSchema, type ClientFormValues } from './clientSchemas';

type ClientModalProps = {
  opened: boolean;
  client?: Client | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: ClientFormValues) => void;
  onDelete?: () => void;
};

const defaults: ClientFormValues = {
  name: '',
  phone: '',
  email: '',
  company: '',
  website: '',
  createdAt: new Date().toISOString().slice(0, 10),
  comment: '',
};

export function ClientModal({
  opened,
  client,
  loading,
  onClose,
  onSubmit,
  onDelete,
}: ClientModalProps) {
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(
      client
        ? {
            ...client,
            createdAt: client.createdAt.slice(0, 10),
            website: client.website ?? '',
            comment: client.comment ?? '',
          }
        : defaults,
    );
  }, [client, reset]);

  const isEditing = Boolean(client && editingClientId === client.id);
  const isClientCard = Boolean(client) && !isEditing;
  const readonly = isClientCard;

  const closeModal = () => {
    setEditingClientId(null);
    onClose();
  };

  const submitForm = handleSubmit((values) => {
    setEditingClientId(null);
    onSubmit(values);
  });

  return (
    <CrmModal
      opened={opened}
      title={client ? 'Карточка клиента' : 'Новый клиент'}
      actions={
        isClientCard || isEditing ? (
          isEditing ? (
            <div className={modalClasses.singleAction}>
              <Button
                className={modalClasses.primaryAction}
                loading={loading}
                onClick={submitForm}
              >
                Сохранить изменения
              </Button>
            </div>
          ) : (
            <div
              className={`${modalClasses.actions} ${modalClasses.clientCardActions}`}
            >
              <Button
                className={modalClasses.primaryAction}
                onClick={() => setEditingClientId(client?.id ?? null)}
              >
                Редактировать
              </Button>
              <Button
                className={`${modalClasses.secondaryAction} ${modalClasses.deleteAction}`}
                variant='default'
                onClick={onDelete}
              >
                Удалить клиента
              </Button>
            </div>
          )
        ) : undefined
      }
      headerMeta={
        client ? `добавлен ${formatDate(client.createdAt)}` : undefined
      }
      hideCancelOnMobile={!client}
      loading={loading}
      mobileBackLabel={client ? undefined : 'Новый клиент'}
      submitLabel='Создать'
      onClose={closeModal}
      onSubmit={client ? undefined : submitForm}
    >
      <form className={modalClasses.modalForm} onSubmit={submitForm}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <CrmTextInput
              readOnly={readonly}
              label='Имя'
              placeholder='Добрыня'
              error={errors.name?.message}
              {...field}
            />
          )}
        />
        <div className={modalClasses.modalFieldRow}>
          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <CrmTextInput
                readOnly={readonly}
                label='Телефон'
                placeholder='+7 915 876-54-32'
                error={errors.phone?.message}
                {...field}
              />
            )}
          />
          <Controller
            name='company'
            control={control}
            render={({ field }) => (
              <CrmTextInput
                readOnly={readonly}
                label='Компания'
                placeholder='Доброград'
                error={errors.company?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className={modalClasses.modalFieldRow}>
          <Controller
            name='website'
            control={control}
            render={({ field }) => (
              <CrmTextInput
                readOnly={readonly}
                label='Сайт'
                placeholder='www.dobrograd.ru'
                error={errors.website?.message}
                {...field}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <CrmTextInput
                readOnly={readonly}
                label='Email'
                placeholder='dobrinia@yandex.ru'
                error={errors.email?.message}
                {...field}
              />
            )}
          />
        </div>
        {client && isEditing ? (
          <Controller
            name='createdAt'
            control={control}
            render={({ field }) => (
              <CrmTextInput
                type='date'
                label='Дата создания'
                error={errors.createdAt?.message}
                {...field}
              />
            )}
          />
        ) : null}
        <Controller
          name='comment'
          control={control}
          render={({ field }) => (
            <CrmTextarea
              readOnly={readonly}
              label='Комментарий'
              placeholder='Прогнозируется рост активности.'
              error={errors.comment?.message}
              {...field}
            />
          )}
        />
      </form>
    </CrmModal>
  );
}

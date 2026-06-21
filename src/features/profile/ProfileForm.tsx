import { Button, Checkbox } from '@mantine/core';
import {
  Controller,
  type Control,
  type FieldErrors,
  useWatch,
} from 'react-hook-form';

import { CrmPasswordInput, CrmTextInput } from '../../components/ui/FormFields';
import modalClasses from '../../components/ui/ui.module.css';
import classes from '../../pages/Page.module.css';
import type { ProfileFormValues } from './profileSchemas';

type ProfileFormProps = {
  control: Control<ProfileFormValues>;
  deleteLoading: boolean;
  errors: FieldErrors<ProfileFormValues>;
  isEditing: boolean;
  newPassword?: string;
  saveLoading: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onLogout: () => void;
  onSubmit: () => void;
};

export function ProfileForm({
  control,
  deleteLoading,
  errors,
  isEditing,
  newPassword,
  saveLoading,
  onDelete,
  onEdit,
  onLogout,
  onSubmit,
}: ProfileFormProps) {
  const profileName = useWatch({ control, name: 'name' });
  
  const avatarInitial =
    (profileName ?? '').trim().charAt(0).toUpperCase() || 'A';

  return (
    <form className={classes.profileCard} onSubmit={onSubmit}>
      <div
        className={classes.profileAvatarPlaceholder}
        aria-label='Заглушка аватара'
        role='img'
      >
        {avatarInitial}
      </div>
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <CrmTextInput
            required
            readOnly={!isEditing}
            label='Имя'
            error={errors.name?.message}
            {...field}
          />
        )}
      />
      <Controller
        name='email'
        control={control}
        render={({ field }) => (
          <CrmTextInput
            required
            readOnly={!isEditing}
            label='Email'
            error={errors.email?.message}
            {...field}
          />
        )}
      />
      <CrmTextInput disabled label='Фамилия' />
      <CrmTextInput disabled label='Имя аккаунта' />
      <Checkbox
        classNames={{
          root: classes.profileCheckboxRoot,
          input: classes.profileCheckboxInput,
          label: classes.profileCheckboxLabel,
        }}
        disabled
        label='Email подтвержден'
      />
      {isEditing ? (
        <>
          <Controller
            name='currentPassword'
            control={control}
            render={({ field }) => (
              <CrmPasswordInput
                label='Текущий пароль'
                error={errors.currentPassword?.message}
                {...field}
              />
            )}
          />
          <Controller
            name='newPassword'
            control={control}
            render={({ field }) => (
              <CrmPasswordInput
                label='Новый пароль'
                error={errors.newPassword?.message}
                {...field}
              />
            )}
          />
          {newPassword ? (
            <Controller
              name='repeatPassword'
              control={control}
              render={({ field }) => (
                <CrmPasswordInput
                  label='Повторить пароль'
                  error={errors.repeatPassword?.message}
                  {...field}
                />
              )}
            />
          ) : null}
        </>
      ) : null}
      {isEditing ? (
        <Button
          className={classes.profileSaveButton}
          type='submit'
          loading={saveLoading}
        >
          Сохранить
        </Button>
      ) : (
        <div className={classes.profileActions}>
          <Button
            className={modalClasses.primaryAction}
            type='button'
            onClick={onEdit}
          >
            Редактировать
          </Button>
          <Button
            className={`${modalClasses.secondaryAction} ${modalClasses.deleteAction}`}
            type='button'
            variant='default'
            loading={deleteLoading}
            onClick={onDelete}
          >
            Удалить
          </Button>
        </div>
      )}
      <button
        className={classes.profileLogoutButton}
        type='button'
        onClick={onLogout}
      >
        Выйти из аккаунта
      </button>
    </form>
  );
}

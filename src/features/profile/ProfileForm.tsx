import { Avatar, Button } from '@mantine/core';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';

import CameraIcon from '../../assets/icons/icons-24x24/camera.svg?react';
import UserIcon from '../../assets/icons/icons-24x24/user.svg?react';
import { CrmPasswordInput, CrmTextInput } from '../../components/ui/FormFields';
import classes from '../../pages/Page.module.css';
import type { ProfileFormValues } from './profileSchemas';

type ProfileFormProps = {
  control: Control<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  hasChanges: boolean;
  isSubmitting: boolean;
  isVisible: boolean;
  newPassword?: string;
  successMessage: string;
  onClearFeedback: () => void;
  onLogout: () => void;
  onSubmit: () => void;
};

type ProfileFieldProps = {
  control: Control<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  onClearFeedback: () => void;
};

type PasswordSectionProps = ProfileFieldProps & {
  newPassword?: string;
};

export function ProfileForm({
  control,
  errors,
  hasChanges,
  isSubmitting,
  isVisible,
  newPassword,
  successMessage,
  onClearFeedback,
  onLogout,
  onSubmit,
}: ProfileFormProps) {
  if (!isVisible) return null;

  return (
    <form noValidate className={classes.profileCard} onSubmit={onSubmit}>
      <div className={classes.profileContent}>
        <section
          aria-label='Основные настройки'
          className={classes.profileIdentity}
        >
          <ProfileAvatar />
          <ProfileIdentityFields
            control={control}
            errors={errors}
            onClearFeedback={onClearFeedback}
          />
        </section>

        <PasswordSection
          control={control}
          errors={errors}
          newPassword={newPassword}
          onClearFeedback={onClearFeedback}
        />
      </div>

      <div className={classes.profileFooter}>
        <div aria-live='polite' className={classes.profileFeedback}>
          {successMessage ? (
            <p className={classes.profileSuccess}>{successMessage}</p>
          ) : null}
          {errors.root?.message ? (
            <p className={classes.profileRootError} role='alert'>
              {errors.root.message}
            </p>
          ) : null}
        </div>
        <div className={classes.profileActions}>
          {hasChanges ? (
            <Button
              className={classes.profileSaveButton}
              type='submit'
              loading={isSubmitting}
            >
              Сохранить изменения
            </Button>
          ) : null}
          <div className={classes.profileAccountLinks}>
            <button
              disabled
              className={classes.profileAccountLink}
              type='button'
            >
              Удалить аккаунт
            </button>
            <button
              className={classes.profileAccountLink}
              type='button'
              onClick={onLogout}
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function ProfileAvatar() {
  return (
    <div className={classes.profileAvatarGroup}>
      <Avatar className={classes.profileAvatarPlaceholder} size={92}>
        <UserIcon aria-hidden='true' className={classes.profileAvatarIcon} />
      </Avatar>
      <button
        disabled
        aria-label='Изменение фото профиля недоступно'
        className={classes.profileAvatarButton}
        type='button'
      >
        <CameraIcon
          aria-hidden='true'
          className={classes.profileAvatarCameraIcon}
        />
      </button>
    </div>
  );
}

function ProfileIdentityFields({
  control,
  errors,
  onClearFeedback,
}: ProfileFieldProps) {
  return (
    <>
      <div className={classes.profileGridRow}>
        <Controller
          name='firstName'
          control={control}
          render={({ field }) => (
            <CrmTextInput
              required
              autoComplete='given-name'
              label='Имя'
              placeholder='Ярополк'
              error={errors.firstName?.message}
              {...field}
              onChange={(event) => {
                onClearFeedback();
                field.onChange(event);
              }}
            />
          )}
        />
        <Controller
          name='lastName'
          control={control}
          render={({ field }) => (
            <CrmTextInput
              required
              autoComplete='family-name'
              label='Фамилия'
              placeholder='Иванов'
              error={errors.lastName?.message}
              {...field}
              onChange={(event) => {
                onClearFeedback();
                field.onChange(event);
              }}
            />
          )}
        />
      </div>

      <div className={classes.profileGridRow}>
        <div className={classes.profileFieldEmail}>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <CrmTextInput
                required
                autoComplete='email'
                label='Email'
                placeholder='ivanov@yandex.ru'
                type='email'
                error={errors.email?.message}
                {...field}
                onChange={(event) => {
                  onClearFeedback();
                  field.onChange(event);
                }}
              />
            )}
          />
        </div>
        <div className={classes.profileFieldAccount}>
          <Controller
            name='accountName'
            control={control}
            render={({ field }) => (
              <CrmTextInput
                required
                autoComplete='username'
                label='Имя аккаунта'
                placeholder='Yaropolk'
                error={errors.accountName?.message}
                {...field}
                onChange={(event) => {
                  onClearFeedback();
                  field.onChange(event);
                }}
              />
            )}
          />
        </div>
      </div>
    </>
  );
}

function PasswordSection({
  control,
  errors,
  newPassword,
  onClearFeedback,
}: PasswordSectionProps) {
  return (
    <section
      aria-labelledby='profile-password-title'
      className={classes.profilePassword}
    >
      <h2 id='profile-password-title'>Пароль</h2>
      <Controller
        name='currentPassword'
        control={control}
        render={({ field }) => (
          <CrmPasswordInput
            autoComplete='current-password'
            label='Существующий пароль'
            placeholder='*******'
            error={errors.currentPassword?.message}
            {...field}
            onChange={(event) => {
              onClearFeedback();
              field.onChange(event);
            }}
          />
        )}
      />
      <div className={classes.profileGridRow}>
        <Controller
          name='newPassword'
          control={control}
          render={({ field }) => (
            <CrmPasswordInput
              autoComplete='new-password'
              label='Новый пароль'
              placeholder='*******'
              error={errors.newPassword?.message}
              {...field}
              onChange={(event) => {
                onClearFeedback();
                field.onChange(event);
              }}
            />
          )}
        />
        <Controller
          name='passwordRepeat'
          control={control}
          render={({ field }) => (
            <CrmPasswordInput
              autoComplete='new-password'
              disabled={!newPassword}
              label='Повторите пароль'
              placeholder='*******'
              error={errors.passwordRepeat?.message}
              {...field}
              onChange={(event) => {
                onClearFeedback();
                field.onChange(event);
              }}
            />
          )}
        />
      </div>
    </section>
  );
}

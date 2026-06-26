import { Alert } from '@mantine/core';

import { ProfileForm } from '../features/profile/ProfileForm';
import { useProfileController } from '../features/profile/useProfileController';
import classes from './Page.module.css';

export function ProfilePage() {
  const profile = useProfileController();

  return (
    <section
      aria-labelledby='profile-page-title'
      className={classes.profilePage}
    >
      <h1 id='profile-page-title' className={classes.profileTitle}>
        Настройка аккаунта
      </h1>
      {!profile.currentUser ? (
        <Alert title='Профиль доступен после входа в аккаунт.' color='blue' />
      ) : null}
      {profile.isLoading ? (
        <Alert title='Загружаем профиль' color='blue' />
      ) : null}
      {profile.isError ? (
        <Alert
          title='Не удалось загрузить профиль. Проверьте, что json-server запущен.'
          color='red'
        />
      ) : null}
      {!profile.isLoading && !profile.isError && !profile.profileUser ? (
        <Alert title='Текущий пользователь не найден в базе.' color='yellow' />
      ) : null}
      <ProfileForm
        control={profile.control}
        errors={profile.errors}
        hasChanges={profile.hasChanges}
        isSubmitting={profile.isSubmitting}
        isVisible={profile.isVisible}
        newPassword={profile.newPassword}
        successMessage={profile.successMessage}
        onClearFeedback={profile.clearProfileFeedback}
        onLogout={profile.logoutProfile}
        onSubmit={profile.submitProfile}
      />
    </section>
  );
}

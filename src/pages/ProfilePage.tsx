import { PageHeader } from '../components/layout/CrmLayout';
import { ProfileForm } from '../features/profile/ProfileForm';
import { useProfileController } from '../features/profile/useProfileController';
import classes from './Page.module.css';

export function ProfilePage() {
  const profile = useProfileController();

  return (
    <section className={classes.profilePage}>
      <PageHeader title='Профиль' />
      <ProfileForm
        control={profile.control}
        deleteLoading={profile.deleteLoading}
        errors={profile.errors}
        isEditing={profile.isEditing}
        newPassword={profile.newPassword}
        saveLoading={profile.saveLoading}
        onDelete={profile.deleteProfile}
        onEdit={profile.startEditing}
        onLogout={profile.logoutProfile}
        onSubmit={profile.submitProfile}
      />
    </section>
  );
}

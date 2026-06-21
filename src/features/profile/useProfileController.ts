import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../api/endpoints/crmEndpoints';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, profileChanged } from '../auth/sessionSlice';
import { profileSchema, type ProfileFormValues } from './profileSchemas';
import { toProfilePayload } from './profileService';

const defaultValues: ProfileFormValues = {
  email: '',
  name: '',
  currentPassword: '',
  newPassword: '',
  repeatPassword: '',
};

function toProfileFormValues({
  email,
  name,
}: Pick<ProfileFormValues, 'email' | 'name'>): ProfileFormValues {
  return {
    email,
    name,
    currentPassword: '',
    newPassword: '',
    repeatPassword: '',
  };
}

export function useProfileController() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.session.user);
  const { data: users = [] } = useGetUsersQuery();

  const [updateUser, { isLoading: saveLoading }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const newPassword = useWatch({
    control: form.control,
    name: 'newPassword',
  });

  useEffect(() => {
    if (currentUser) {
      form.reset(toProfileFormValues(currentUser));
    }
  }, [currentUser, form]);

  useEffect(() => {
    if (!newPassword) {
      form.setValue('repeatPassword', '');
    }
  }, [form, newPassword]);

  const submitProfile = form.handleSubmit(async (values) => {
    if (!currentUser) return;

    try {
      const updatedUser = await updateUser({
        id: currentUser.id,
        ...toProfilePayload(values, users, currentUser),
      }).unwrap();
      dispatch(profileChanged(updatedUser));
      form.reset(toProfileFormValues(updatedUser));
      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось сохранить профиль';

      if (message.includes('пароль')) {
        form.setError('currentPassword', { message });
      } else {
        form.setError('email', { message });
      }
    }
  });

  const startEditing = () => {
    if (currentUser) {
      form.reset(toProfileFormValues(currentUser));
    }
    setIsEditing(true);
  };

  const deleteProfile = async () => {
    if (!currentUser) return;

    await deleteUser({ id: currentUser.id }).unwrap();

    dispatch(logout());
    navigate('/');
  };

  const logoutProfile = () => {
    dispatch(logout());
    navigate('/');
  };

  return {
    control: form.control,
    deleteLoading,
    errors: form.formState.errors,
    isEditing,
    newPassword,
    saveLoading,
    deleteProfile,
    logoutProfile,
    startEditing,
    submitProfile,
  };
}

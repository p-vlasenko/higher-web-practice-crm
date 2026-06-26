import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../api/endpoints/crmEndpoints';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { User } from '../../types/user';
import { logout, profileChanged } from '../auth/sessionSlice';
import { profileSchema, type ProfileFormValues } from './profileSchemas';
import { toProfilePayload } from './profileService';

const emptyProfileForm: ProfileFormValues = {
  accountName: '',
  email: '',
  firstName: '',
  lastName: '',
  currentPassword: '',
  newPassword: '',
  passwordRepeat: '',
};

const passwordErrorTarget = 'currentPassword';
const fallbackSaveError = 'Не удалось сохранить профиль';

function getProfileFormValues(user: User): ProfileFormValues {
  return {
    ...emptyProfileForm,
    accountName: user.accountName,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

function getSaveErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : fallbackSaveError;
}

function getSaveErrorTarget(message: string) {
  return message.includes('пароль') ? passwordErrorTarget : 'email';
}

export function useProfileController() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.session.user);
  const { data: users = [], isError, isLoading } = useGetUsersQuery({});
  const profileUser = useMemo(
    () => users.find((user) => user.id === currentUser?.id) ?? null,
    [currentUser?.id, users],
  );

  const [updateUser, { isLoading: saveLoading }] = useUpdateUserMutation();
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: emptyProfileForm,
  });

  const newPassword = useWatch({
    control: form.control,
    name: 'newPassword',
  });

  const resetFormToUser = useCallback(
    (user: User) => {
      form.reset(getProfileFormValues(user));
    },
    [form],
  );

  useEffect(() => {
    const user = profileUser ?? currentUser;

    if (user) {
      resetFormToUser(user);
    }
  }, [currentUser, profileUser, resetFormToUser]);

  useEffect(() => {
    if (!newPassword) {
      form.setValue('passwordRepeat', '');
    }
  }, [form, newPassword]);

  const clearProfileFeedback = useCallback(() => {
    setSuccessMessage('');
    form.clearErrors('root');
  }, [form]);

  const logoutProfile = useCallback(() => {
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  const submitProfile = form.handleSubmit(async (values) => {
    if (!currentUser || !profileUser) {
      form.setError('root', {
        message:
          'Не удалось загрузить полный профиль. Проверьте, что json-server запущен.',
      });
      return;
    }

    clearProfileFeedback();

    try {
      const updatedUser = await updateUser({
        id: currentUser.id,
        ...toProfilePayload(values, users, profileUser),
      }).unwrap();

      dispatch(profileChanged(updatedUser));
      resetFormToUser(updatedUser);
      setSuccessMessage('Изменения сохранены');
    } catch (error) {
      const message = getSaveErrorMessage(error);

      form.setError(getSaveErrorTarget(message), { message });
    }
  });

  return {
    control: form.control,
    currentUser,
    errors: form.formState.errors,
    hasChanges: form.formState.isDirty,
    isError,
    isLoading,
    isSubmitting: form.formState.isSubmitting || saveLoading,
    isVisible: !isLoading && !isError && Boolean(profileUser),
    newPassword,
    profileUser,
    successMessage,
    clearProfileFeedback,
    logoutProfile,
    submitProfile,
  };
}

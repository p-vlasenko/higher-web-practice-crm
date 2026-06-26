import type { UpdateProfilePayload, User } from '../../types/user';
import { isEmailTaken } from '../auth/authService';
import type { ProfileFormValues } from './profileSchemas';

// email check logic should be moved to backend
export function toProfilePayload(
  values: ProfileFormValues,
  users: User[],
  currentUser: User,
): UpdateProfilePayload {
  const email = values.email.trim().toLowerCase();

  if (isEmailTaken(users, email, currentUser.id)) {
    throw new Error('Email уже используется');
  }

  if (values.newPassword && currentUser?.password !== values.currentPassword) {
    throw new Error('Неверный текущий пароль');
  }

  return {
    accountName: values.accountName.trim(),
    email,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    password: values.newPassword || undefined,
  };
}

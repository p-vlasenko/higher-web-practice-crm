import type { UpdateProfilePayload, User } from '../../types/user';
import { isEmailTaken } from '../auth/authService';
import type { ProfileFormValues } from './profileSchemas';

// email check logic should be moved to backend
export function toProfilePayload(
  values: ProfileFormValues,
  users: User[],
  currentUser: User,
): UpdateProfilePayload {
  if (isEmailTaken(users, values.email, currentUser.id)) {
    throw new Error('Email уже используется');
  }

  if (values.newPassword && currentUser?.password !== values.currentPassword) {
    throw new Error('Неверный текущий пароль');
  }

  return {
    email: values.email,
    name: values.name,
    password: values.newPassword || undefined,
  };
}

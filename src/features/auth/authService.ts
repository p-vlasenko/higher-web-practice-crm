import type { LoginPayload, RegisterPayload, User } from '../../types/user';

export function findUserByCredentials(users: User[], payload: LoginPayload) {
  return users.find(
    (user) =>
      user.email.toLowerCase() === payload.email.toLowerCase() &&
      user.password === payload.password,
  );
}

export function isEmailTaken(
  users: User[],
  email: string,
  currentUserId?: string,
) {
  return users.some(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.id !== currentUserId,
  );
}

export function createUserPayload(payload: RegisterPayload): User {
  return {
    accountName: payload.accountName.trim(),
    email: payload.email.trim().toLowerCase(),
    firstName: payload.firstName.trim(),
    id: crypto.randomUUID(),
    lastName: payload.lastName.trim(),
    password: payload.password,
    createdAt: new Date().toISOString(),
  };
}

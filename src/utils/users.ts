import type { User } from '../types/user';

export function getUserFullName(user: Pick<User, 'firstName' | 'lastName'>) {
  return [user.firstName, user.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');
}

export function getUserDisplayName(
  user: Pick<User, 'accountName' | 'firstName' | 'lastName'>,
) {
  return getUserFullName(user) || user.accountName;
}

export function getUserFirstName(
  user: Pick<User, 'accountName' | 'firstName'>,
) {
  return user.firstName.trim() || user.accountName;
}

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User } from '../../types/user';

type SessionState = {
  user: User | null;
  status: 'anonymous' | 'authenticated';
};

const storageKey = 'crm.activeUser';

function readStoredUser(): User | null {
  if (typeof window === 'undefined') return null;

  const rawValue = window.localStorage.getItem(storageKey);
  if (!rawValue) return null;

  try {
    const user = JSON.parse(rawValue) as Partial<User>;
    if (
      typeof user.id === 'string' &&
      typeof user.email === 'string' &&
      typeof user.firstName === 'string' &&
      typeof user.lastName === 'string' &&
      typeof user.accountName === 'string' &&
      typeof user.createdAt === 'string'
    ) {
      return user as User;
    }
  } catch {
    window.localStorage.removeItem(storageKey);
  }

  return null;
}

function writeStoredUser(user: User) {
  window.localStorage.setItem(storageKey, JSON.stringify(user));
}

const getInitialState = (): SessionState => {
  const user = readStoredUser();
  return user
    ? { user, status: 'authenticated' }
    : { user: null, status: 'anonymous' };
};

const sessionSlice = createSlice({
  name: 'session',
  initialState: getInitialState,
  reducers: {
    loginSucceeded(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = 'authenticated';
      writeStoredUser(action.payload);
    },
    profileChanged(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = 'authenticated';
      writeStoredUser(action.payload);
    },
    logout(state) {
      state.user = null;
      state.status = 'anonymous';
      window.localStorage.removeItem(storageKey);
    },
  },
});

export const { loginSucceeded, logout, profileChanged } = sessionSlice.actions;
export default sessionSlice.reducer;

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { MantineProvider } from '@mantine/core';

import { crmTheme } from '../styles/theme';
import type { User } from '../types/user';
import { ProfilePage } from './ProfilePage';

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockUseAppSelector = jest.fn();
const mockGetUsersQuery = jest.fn();
const mockUpdateUser = jest.fn();

jest.mock('../app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: unknown) => mockUseAppSelector(selector),
}));

jest.mock('../api/endpoints/crmEndpoints', () => ({
  useGetUsersQuery: (...args: unknown[]) => mockGetUsersQuery(...args),
  useUpdateUserMutation: () => [mockUpdateUser, { isLoading: false }],
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const currentUser: User = {
  accountName: 'ivan-account',
  createdAt: '2026-01-01',
  email: 'ivan@testmail.com',
  firstName: 'Ivan',
  id: 'user-1',
  lastName: 'Ivanov',
  password: '123456',
};

function getNamedInput(name: string) {
  const input = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]`,
  );

  if (!input) {
    throw new Error(`Input "${name}" not found`);
  }

  return input;
}

async function typeNamedInput(
  user: ReturnType<typeof userEvent.setup>,
  name: string,
  value: string,
) {
  const input = getNamedInput(name);

  await user.clear(input);
  await user.type(input, value);
}

function renderProfilePage() {
  return render(
    <MantineProvider theme={crmTheme}>
      <ProfilePage />
    </MantineProvider>,
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockNavigate.mockReset();
    mockUseAppSelector.mockReset();
    mockGetUsersQuery.mockReset();
    mockUpdateUser.mockReset();

    mockUseAppSelector.mockImplementation((selector) =>
      (selector as (state: { session: { user: User } }) => unknown)({
        session: { user: currentUser },
      }),
    );
    mockGetUsersQuery.mockReturnValue({
      data: [currentUser],
      isError: false,
      isLoading: false,
    });
  });

  it('saves profile changes and shows success feedback', async () => {
    const user = userEvent.setup();
    const updatedUser: User = {
      ...currentUser,
      firstName: 'Petr',
    };

    mockUpdateUser.mockReturnValue({
      unwrap: () => Promise.resolve(updatedUser),
    });

    renderProfilePage();

    await typeNamedInput(user, 'firstName', 'Petr');
    await user.click(
      screen.getByRole('button', { name: 'Сохранить изменения' }),
    );

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        accountName: currentUser.accountName,
        email: currentUser.email,
        firstName: 'Petr',
        id: currentUser.id,
        lastName: currentUser.lastName,
        password: undefined,
      });
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(await screen.findByText('Изменения сохранены')).not.toBeNull();
  });

  it('shows duplicate email error before saving', async () => {
    const user = userEvent.setup();
    const duplicateUser: User = {
      ...currentUser,
      accountName: 'taken',
      email: 'taken@testmail.com',
      id: 'user-2',
    };

    mockGetUsersQuery.mockReturnValue({
      data: [currentUser, duplicateUser],
      isError: false,
      isLoading: false,
    });

    renderProfilePage();

    await typeNamedInput(user, 'email', 'taken@testmail.com');
    await user.click(
      screen.getByRole('button', { name: 'Сохранить изменения' }),
    );

    expect(await screen.findByText('Email уже используется')).not.toBeNull();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('requires current password and matching repeat when password changes', async () => {
    const user = userEvent.setup();

    renderProfilePage();

    await typeNamedInput(user, 'newPassword', '654321');
    await typeNamedInput(user, 'passwordRepeat', '111111');
    await user.click(
      screen.getByRole('button', { name: 'Сохранить изменения' }),
    );

    expect(await screen.findByText('Введите текущий пароль')).not.toBeNull();
    expect(await screen.findByText('Пароли не совпадают')).not.toBeNull();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('logs out and navigates to login page', async () => {
    const user = userEvent.setup();

    renderProfilePage();

    await user.click(screen.getByRole('button', { name: 'Выйти из аккаунта' }));

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

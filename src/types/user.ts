export type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountName: string;
  createdAt: string;
};

export type UserProfile = User & {
  password?: string;
};

export type RegisterPayload = {
  accountName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UpdateProfilePayload = {
  accountName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
};

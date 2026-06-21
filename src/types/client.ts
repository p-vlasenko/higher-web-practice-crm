export type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  website?: string;
  comment?: string;

  createdAt: string;
  deleted?: boolean;

  createdBy: string; // userId
};

export type ClientSortKey =
  | 'name'
  | 'phone'
  | 'email'
  | 'company'
  | 'website'
  | 'comment'
  | 'createdAt';

export type CreateClientPayload = {
  name: string;
  phone: string;
  email: string;
  company: string;
  website?: string;
  comment?: string;
};

export type UpdateClientPayload = Partial<CreateClientPayload>;

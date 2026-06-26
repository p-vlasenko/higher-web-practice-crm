import type { Client } from '../types/client';

export function isActiveClient(client: Client) {
  return client.deleted !== true;
}

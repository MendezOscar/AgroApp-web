import { apiClient } from '@/shared/lib/api-client';
import type { AppUser } from '@/shared/types/domain';

export async function getUsers(): Promise<AppUser[]> {
  const { data } = await apiClient.get<AppUser[]>('/users');
  return data;
}

export async function inviteUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<void> {
  await apiClient.post('/users/invite', input);
}

export async function toggleUser(id: string, isActive: boolean): Promise<void> {
  await apiClient.patch(`/users/${id}/toggle`, { isActive });
}

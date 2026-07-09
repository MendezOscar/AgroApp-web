import { apiClient } from '@/shared/lib/api-client';
import type { AuthSession } from '@/shared/types/auth';

interface LoginResponse {
  accessToken?: string;
  token?: string;
  refreshToken: string;
  name: string;
  email: string;
  role?: string;
  tenantId: string;
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, password });
  const token = data.accessToken ?? data.token;
  if (!token) throw new Error('Respuesta de login inválida');

  return {
    token,
    refreshToken: data.refreshToken,
    name: data.name,
    email: data.email,
    role: data.role ?? 'Viewer',
    tenantId: data.tenantId,
  };
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}

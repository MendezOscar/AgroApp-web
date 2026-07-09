import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSession } from '@/shared/types/auth';

interface AuthStore {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  updateTokens: (token: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      updateTokens: (token, refreshToken) =>
        set((state) =>
          state.session ? { session: { ...state.session, token, refreshToken } } : state,
        ),
    }),
    { name: 'agroapp-auth' },
  ),
);

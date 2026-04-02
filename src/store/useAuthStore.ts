import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  lastLogin: number | null;
  login: (user: User) => void;
  logout: () => void;
  checkSession: () => boolean;
}

const SESSION_DURATION = 6 * 60 * 60 * 1000; // 6 hours in ms

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      lastLogin: null,

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          lastLogin: Date.now(),
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          lastLogin: null,
        }),

      checkSession: () => {
        const { lastLogin, isAuthenticated } = get();
        if (!isAuthenticated || !lastLogin) return false;

        const now = Date.now();
        if (now - lastLogin > SESSION_DURATION) {
          set({ user: null, isAuthenticated: false, lastLogin: null });
          return false;
        }

        return true;
      },
    }),
    {
      name: 'pulso-rh-auth',
    }
  )
);

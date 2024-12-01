import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (userData: { _id: string; email: string; displayName: string; isAdmin: boolean; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (userData) => set({
        user: {
          _id: userData._id,
          email: userData.email,
          displayName: userData.displayName,
          isAdmin: userData.isAdmin,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: userData.token
      }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { mockLogin, mockRegister } from '@/lib/dummyData';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthMock = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const result = mockLogin(email, password);
          if (result) {
            set({ 
              user: result.user, 
              token: result.token, 
              isAuthenticated: true 
            });
            return { success: true };
          } else {
            return { success: false, error: 'Invalid email or password' };
          }
        } catch (error) {
          return { success: false, error: 'Login failed' };
        }
      },
      register: async (name: string, email: string, password: string) => {
        try {
          const result = mockRegister(name, email, password);
          set({ 
            user: result.user, 
            token: result.token, 
            isAuthenticated: true 
          });
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Registration failed' };
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'auth-mock-storage',
    }
  )
);
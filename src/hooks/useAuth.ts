
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            return { error: error.message };
          }

          if (data.user && data.session) {
            // Get user profile from our users table
            const { data: userProfile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('email', data.user.email)
              .single();

            if (profileError) {
              return { error: 'User profile not found' };
            }

            const user: User = {
              id: userProfile.id,
              name: userProfile.username,
              email: userProfile.email,
              avatarUrl: userProfile.avatar
            };

            set({ 
              user, 
              token: data.session.access_token, 
              isAuthenticated: true 
            });
          }

          return {};
        } catch (error: any) {
          return { error: error.message || 'Login failed' };
        }
      },

      register: async (email: string, password: string, username: string) => {
        try {
          // First create auth user
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            return { error: error.message };
          }

          if (data.user) {
            // Create user profile in our users table
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                username: username,
                email: email,
                password: password, // In production, this should be hashed
              });

            if (profileError) {
              return { error: 'Failed to create user profile' };
            }

            const user: User = {
              id: data.user.id,
              name: username,
              email: email,
            };

            if (data.session) {
              set({ 
                user, 
                token: data.session.access_token, 
                isAuthenticated: true 
              });
            }
          }

          return {};
        } catch (error: any) {
          return { error: error.message || 'Registration failed' };
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null, token: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Get user profile from our users table
            const { data: userProfile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userProfile) {
              const user: User = {
                id: userProfile.id,
                name: userProfile.username,
                email: userProfile.email,
                avatarUrl: userProfile.avatar
              };

              set({ 
                user, 
                token: session.access_token, 
                isAuthenticated: true 
              });
            }
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
              set({ user: null, token: null, isAuthenticated: false });
            } else if (session?.user) {
              const { data: userProfile } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (userProfile) {
                const user: User = {
                  id: userProfile.id,
                  name: userProfile.username,
                  email: userProfile.email,
                  avatarUrl: userProfile.avatar
                };

                set({ 
                  user, 
                  token: session.access_token, 
                  isAuthenticated: true 
                });
              }
            }
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

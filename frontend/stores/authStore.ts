import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gql } from '@apollo/client';
import { client } from '@/lib/apollo-client';
import { User, LoginInput, RegisterInput } from '@/types/graphql';

// GraphQL mutations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  
  // Actions
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      isHydrated: false,

      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),

      login: async (input: LoginInput) => {
        set({ isLoading: true });
        try {
          const { data } = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: input,
          });

          if (data?.login) {
            const { token, user } = data.login;
            set({ user, token, isLoading: false });
            return { success: true };
          }
          
          set({ isLoading: false });
          return { success: false, error: 'Login failed' };
        } catch (error: any) {
          set({ isLoading: false });
          console.error('Login error:', error);
          return { 
            success: false, 
            error: error.message || 'Login failed' 
          };
        }
      },

      register: async (input: RegisterInput) => {
        set({ isLoading: true });
        try {
          const { data } = await client.mutate({
            mutation: REGISTER_MUTATION,
            variables: { input },
          });

          if (data?.register) {
            const { token, user } = data.register;
            set({ user, token, isLoading: false });
            return { success: true };
          }
          
          set({ isLoading: false });
          return { success: false, error: 'Registration failed' };
        } catch (error: any) {
          set({ isLoading: false });
          console.error('Registration error:', error);
          return { 
            success: false, 
            error: error.message || 'Registration failed' 
          };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Clear Apollo cache
          await client.clearStore();
          set({ user: null, token: null, isLoading: false });
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
        }
      },

      clearAuth: () => {
        set({ user: null, token: null, isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.token);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useIsHydrated = () => useAuthStore((state) => state.isHydrated);

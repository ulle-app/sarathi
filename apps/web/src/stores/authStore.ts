import { create } from 'zustand';
import { User } from '@/types/api';
import { authApi, userApi, setAccessToken } from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, academicLevel?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  isInitialized: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authApi.login({ email, password });
      set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string, academicLevel?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authApi.register({ email, password, firstName, lastName, academicLevel });
      set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  refreshAuth: async () => {
    // If already initialized and no user, don't try again
    if (get().isInitialized && !get().user) {
      return;
    }

    // If we already have a user, we're done
    if (get().user) {
      set({ isLoading: false, isInitialized: true });
      return;
    }

    set({ isLoading: true });
    // Wrap refresh attempt with a timeout so UI doesn't hang forever
    const refreshPromise = (async () => {
      try {
        await authApi.refresh();
        const user = await userApi.getMe();
        set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
      } catch {
        setAccessToken(null);
        set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
      }
    })();

    const timeout = new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 5000);
    });

    // Wait for whichever finishes first (refresh or timeout)
    await Promise.race([refreshPromise, timeout]);
    // Ensure init flag is set if not already
    if (!get().isInitialized) {
      set({ isInitialized: true, isLoading: false });
    }
  },

  updateUser: (user: User) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },
}));

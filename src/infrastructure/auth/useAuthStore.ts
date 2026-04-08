import { create } from 'zustand';
import { authApi } from '@/infrastructure/api/authApi';
import { setAuthToken, restoreAuthToken } from '@/infrastructure/api/apiClient';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  business_name: string;
  business_type: string;
  plan: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (data: {
    name: string;
    email: string;
    password: string;
    businessName: string;
    businessType: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  register: async ({ name, email, password, businessName, businessType }) => {
    set({ isLoading: true, error: null });
    try {
      const { access_token } = await authApi.register({
        name,
        email,
        password,
        business_name: businessName,
        business_type: businessType,
      });
      setAuthToken(access_token);
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Error al registrar' });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { access_token } = await authApi.login(email, password);
      setAuthToken(access_token);
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Credenciales invalidas' });
    }
  },

  logout: () => {
    setAuthToken(null);
    set({ user: null, isAuthenticated: false, error: null });
  },

  restoreSession: async () => {
    const token = restoreAuthToken();
    if (!token) return;
    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true });
    } catch {
      setAuthToken(null);
    }
  },

  clearError: () => set({ error: null }),
}));

import { create } from 'zustand';
import { User, AuthSession, BusinessType, Plan } from '@/core/domain/entities/User';
import { LocalStorageUserRepository, LocalStorageAuthSessionRepository } from '@/infrastructure/auth/AuthRepository';
import { hashPassword } from '@/infrastructure/auth/hashPassword';
import { DuplicateEmailError, InvalidCredentialsError } from '@/core/shared/errors';
import { v4 as uuidv4 } from 'uuid';

const userRepo = new LocalStorageUserRepository();
const sessionRepo = new LocalStorageAuthSessionRepository();

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (data: {
    name: string;
    email: string;
    password: string;
    businessName: string;
    businessType: BusinessType;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => void;
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
      const existing = userRepo.findByEmail(email);
      if (existing) throw new DuplicateEmailError();

      const passwordHash = await hashPassword(password);
      const user = userRepo.create({
        name,
        email,
        passwordHash,
        businessName,
        businessType,
        plan: Plan.BASICO,
      });

      const session: AuthSession = {
        userId: user.id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      sessionRepo.create(session);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Error desconocido' });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = userRepo.findByEmail(email);
      if (!user) throw new InvalidCredentialsError();

      const hash = await hashPassword(password);
      if (hash !== user.passwordHash) throw new InvalidCredentialsError();

      userRepo.update(user.id, { lastLoginAt: new Date() });

      const session: AuthSession = {
        userId: user.id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      sessionRepo.create(session);
      set({ user: { ...user, lastLoginAt: new Date() }, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Error desconocido' });
    }
  },

  logout: () => {
    sessionRepo.clear();
    set({ user: null, isAuthenticated: false, error: null });
  },

  restoreSession: () => {
    const session = sessionRepo.getCurrent();
    if (!session) return;
    const user = userRepo.findById(session.userId);
    if (user) {
      set({ user, isAuthenticated: true });
    } else {
      sessionRepo.clear();
    }
  },

  clearError: () => set({ error: null }),
}));

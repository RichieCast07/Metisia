import { User, AuthSession } from '../entities/User';

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>): User;
  findByEmail(email: string): User | null;
  findById(id: string): User | null;
  update(id: string, data: Partial<User>): User;
}

export interface IAuthSessionRepository {
  create(session: AuthSession): void;
  getCurrent(): AuthSession | null;
  clear(): void;
}

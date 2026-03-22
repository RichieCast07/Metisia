import { v4 as uuidv4 } from 'uuid';
import { User, AuthSession } from '../../core/domain/entities/User';
import { IUserRepository, IAuthSessionRepository } from '../../core/domain/repositories/IUserRepository';
import { storage } from '../storage/StorageAdapter';

export class LocalStorageUserRepository implements IUserRepository {
  create(data: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>): User {
    const users = storage.getGlobalItems<User>('users');
    const user: User = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };
    users.push(user);
    storage.setGlobalItems('users', users);
    return user;
  }

  findByEmail(email: string): User | null {
    const users = storage.getGlobalItems<User>('users');
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  findById(id: string): User | null {
    const users = storage.getGlobalItems<User>('users');
    return users.find(u => u.id === id) ?? null;
  }

  update(id: string, data: Partial<User>): User {
    const users = storage.getGlobalItems<User>('users');
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Usuario no encontrado');
    users[index] = { ...users[index], ...data };
    storage.setGlobalItems('users', users);
    return users[index];
  }
}

export class LocalStorageAuthSessionRepository implements IAuthSessionRepository {
  create(session: AuthSession): void {
    storage.setGlobalItem('session', session);
  }

  getCurrent(): AuthSession | null {
    const session = storage.getGlobalItem<AuthSession>('session');
    if (!session) return null;
    if (new Date(session.expiresAt) < new Date()) {
      this.clear();
      return null;
    }
    return session;
  }

  clear(): void {
    storage.removeGlobalItem('session');
  }
}

export class StorageAdapter {
  private prefix: string;

  constructor(prefix: string = 'metisia') {
    this.prefix = prefix;
  }

  private buildKey(businessId: string, entity: string): string {
    return `${this.prefix}_${businessId}_${entity}`;
  }

  private buildGlobalKey(entity: string): string {
    return `${this.prefix}_${entity}`;
  }

  getItems<T>(businessId: string, entity: string): T[] {
    try {
      const key = this.buildKey(businessId, entity);
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  setItems<T>(businessId: string, entity: string, items: T[]): void {
    const key = this.buildKey(businessId, entity);
    localStorage.setItem(key, JSON.stringify(items));
  }

  getGlobalItems<T>(entity: string): T[] {
    try {
      const key = this.buildGlobalKey(entity);
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  setGlobalItems<T>(entity: string, items: T[]): void {
    const key = this.buildGlobalKey(entity);
    localStorage.setItem(key, JSON.stringify(items));
  }

  getGlobalItem<T>(entity: string): T | null {
    try {
      const key = this.buildGlobalKey(entity);
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  setGlobalItem<T>(entity: string, item: T): void {
    const key = this.buildGlobalKey(entity);
    localStorage.setItem(key, JSON.stringify(item));
  }

  removeGlobalItem(entity: string): void {
    const key = this.buildGlobalKey(entity);
    localStorage.removeItem(key);
  }

  clearAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }

  exportAll(): string {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) ?? '');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    return JSON.stringify(data, null, 2);
  }

  importAll(json: string): void {
    const data = JSON.parse(json) as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith(this.prefix)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  }
}

export const storage = new StorageAdapter();

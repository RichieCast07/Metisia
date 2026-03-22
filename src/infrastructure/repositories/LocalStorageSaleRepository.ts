import { v4 as uuidv4 } from 'uuid';
import { Sale } from '../../core/domain/entities/Sale';
import { ISaleRepository } from '../../core/domain/repositories/ISaleRepository';
import { storage } from '../storage/StorageAdapter';

export class LocalStorageSaleRepository implements ISaleRepository {
  create(data: Omit<Sale, 'id' | 'createdAt'>): Sale {
    const items = storage.getItems<Sale>(data.businessId, 'sales');
    const sale: Sale = { ...data, id: uuidv4(), createdAt: new Date() };
    items.push(sale);
    storage.setItems(data.businessId, 'sales', items);
    return sale;
  }

  getById(id: string): Sale | null {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_sales')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) ?? '[]') as Sale[];
          const found = items.find(s => s.id === id);
          if (found) return found;
        } catch { /* skip */ }
      }
    }
    return null;
  }

  getAll(businessId: string): Sale[] {
    return storage.getItems<Sale>(businessId, 'sales');
  }

  getByDateRange(businessId: string, from: Date, to: Date): Sale[] {
    const items = storage.getItems<Sale>(businessId, 'sales');
    return items.filter(s => {
      const d = new Date(s.createdAt);
      return d >= from && d <= to;
    });
  }

  delete(id: string): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_sales')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) ?? '[]') as Sale[];
          const filtered = items.filter(s => s.id !== id);
          if (filtered.length !== items.length) {
            localStorage.setItem(key, JSON.stringify(filtered));
            return;
          }
        } catch { /* skip */ }
      }
    }
  }
}

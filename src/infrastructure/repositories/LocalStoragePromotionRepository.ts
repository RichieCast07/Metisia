import { v4 as uuidv4 } from 'uuid';
import { Promotion } from '../../core/domain/entities/Promotion';
import { IPromotionRepository } from '../../core/domain/repositories/IPromotionRepository';
import { storage } from '../storage/StorageAdapter';

export class LocalStoragePromotionRepository implements IPromotionRepository {
  create(data: Omit<Promotion, 'id' | 'createdAt'>): Promotion {
    const items = storage.getItems<Promotion>(data.businessId, 'promotions');
    const promotion: Promotion = { ...data, id: uuidv4(), createdAt: new Date() };
    items.push(promotion);
    storage.setItems(data.businessId, 'promotions', items);
    return promotion;
  }

  update(id: string, data: Partial<Promotion>): Promotion {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_promotions')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) ?? '[]') as Promotion[];
          const index = items.findIndex(p => p.id === id);
          if (index !== -1) {
            items[index] = { ...items[index], ...data };
            localStorage.setItem(key, JSON.stringify(items));
            return items[index];
          }
        } catch { /* skip */ }
      }
    }
    throw new Error('Promoción no encontrada');
  }

  delete(id: string): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_promotions')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) ?? '[]') as Promotion[];
          const filtered = items.filter(p => p.id !== id);
          if (filtered.length !== items.length) {
            localStorage.setItem(key, JSON.stringify(filtered));
            return;
          }
        } catch { /* skip */ }
      }
    }
  }

  getById(id: string): Promotion | null {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_promotions')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) ?? '[]') as Promotion[];
          const found = items.find(p => p.id === id);
          if (found) return found;
        } catch { /* skip */ }
      }
    }
    return null;
  }

  getAll(businessId: string): Promotion[] {
    return storage.getItems<Promotion>(businessId, 'promotions');
  }

  getActive(businessId: string): Promotion[] {
    return this.getAll(businessId).filter(p => p.isActive);
  }
}

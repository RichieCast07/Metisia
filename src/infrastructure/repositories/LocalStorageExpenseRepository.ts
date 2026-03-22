import { v4 as uuidv4 } from 'uuid';
import { Expense } from '../../core/domain/entities/Expense';
import { IExpenseRepository } from '../../core/domain/repositories/IExpenseRepository';
import { storage } from '../storage/StorageAdapter';

export class LocalStorageExpenseRepository implements IExpenseRepository {
  create(data: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const items = storage.getItems<Expense>(data.businessId, 'expenses');
    const expense: Expense = { ...data, id: uuidv4(), createdAt: new Date() };
    items.push(expense);
    storage.setItems(data.businessId, 'expenses', items);
    return expense;
  }

  delete(id: string): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_expenses')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) ?? '[]') as Expense[];
          const filtered = items.filter(e => e.id !== id);
          if (filtered.length !== items.length) {
            localStorage.setItem(key, JSON.stringify(filtered));
            return;
          }
        } catch { /* skip */ }
      }
    }
  }

  getAll(businessId: string): Expense[] {
    return storage.getItems<Expense>(businessId, 'expenses');
  }

  getByDateRange(businessId: string, from: Date, to: Date): Expense[] {
    const items = storage.getItems<Expense>(businessId, 'expenses');
    return items.filter(e => {
      const d = new Date(e.date);
      return d >= from && d <= to;
    });
  }
}

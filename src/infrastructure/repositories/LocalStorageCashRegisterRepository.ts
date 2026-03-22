import { v4 as uuidv4 } from 'uuid';
import { CashRegister, CashRegisterHistory, CashRegisterStatus } from '../../core/domain/entities/CashRegister';
import { ICashRegisterRepository, ICashRegisterHistoryRepository } from '../../core/domain/repositories/ICashRegisterRepository';
import { storage } from '../storage/StorageAdapter';

export class LocalStorageCashRegisterRepository implements ICashRegisterRepository {
  create(data: Omit<CashRegister, 'id'>): CashRegister {
    const items = storage.getItems<CashRegister>(data.businessId, 'cash_registers');
    const register: CashRegister = { ...data, id: uuidv4() };
    items.push(register);
    storage.setItems(data.businessId, 'cash_registers', items);
    return register;
  }

  update(id: string, data: Partial<CashRegister>): CashRegister {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_cash_registers')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) ?? '[]') as CashRegister[];
          const index = items.findIndex(r => r.id === id);
          if (index !== -1) {
            items[index] = { ...items[index], ...data };
            localStorage.setItem(key, JSON.stringify(items));
            return items[index];
          }
        } catch { /* skip */ }
      }
    }
    throw new Error('Caja no encontrada');
  }

  getCurrent(businessId: string): CashRegister | null {
    const items = storage.getItems<CashRegister>(businessId, 'cash_registers');
    return items.find(r => r.status === CashRegisterStatus.ABIERTA) ?? null;
  }

  getAll(businessId: string): CashRegister[] {
    return storage.getItems<CashRegister>(businessId, 'cash_registers');
  }
}

export class LocalStorageCashRegisterHistoryRepository implements ICashRegisterHistoryRepository {
  create(data: Omit<CashRegisterHistory, 'id'>): CashRegisterHistory {
    const items = storage.getItems<CashRegisterHistory>(data.businessId, 'cash_history');
    const history: CashRegisterHistory = { ...data, id: uuidv4() };
    items.push(history);
    storage.setItems(data.businessId, 'cash_history', items);
    return history;
  }

  getAll(businessId: string): CashRegisterHistory[] {
    return storage.getItems<CashRegisterHistory>(businessId, 'cash_history');
  }
}

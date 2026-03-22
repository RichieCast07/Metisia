import { CashRegister, CashRegisterHistory } from '../entities/CashRegister';

export interface ICashRegisterRepository {
  create(register: Omit<CashRegister, 'id'>): CashRegister;
  update(id: string, data: Partial<CashRegister>): CashRegister;
  getCurrent(businessId: string): CashRegister | null;
  getAll(businessId: string): CashRegister[];
}

export interface ICashRegisterHistoryRepository {
  create(history: Omit<CashRegisterHistory, 'id'>): CashRegisterHistory;
  getAll(businessId: string): CashRegisterHistory[];
}

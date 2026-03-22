import { CashRegister, CashRegisterHistory, CashRegisterStatus } from '../entities/CashRegister';
import { ICashRegisterRepository, ICashRegisterHistoryRepository } from '../repositories/ICashRegisterRepository';
import { ISaleRepository } from '../repositories/ISaleRepository';
import { IExpenseRepository } from '../repositories/IExpenseRepository';
import { ValidationError } from '../../shared/errors';
import { startOfDay, endOfDay } from 'date-fns';

export function openCashRegister(
  repo: ICashRegisterRepository,
  businessId: string,
  amount: number,
  openedBy: string
): CashRegister {
  const current = repo.getCurrent(businessId);
  if (current && current.status === CashRegisterStatus.ABIERTA) {
    throw new ValidationError('Ya hay una caja abierta');
  }

  return repo.create({
    businessId,
    status: CashRegisterStatus.ABIERTA,
    openingAmount: amount,
    openedAt: new Date(),
    openedBy,
  });
}

export function closeCashRegister(
  cashRepo: ICashRegisterRepository,
  historyRepo: ICashRegisterHistoryRepository,
  saleRepo: ISaleRepository,
  expenseRepo: IExpenseRepository,
  businessId: string,
  closingAmount: number
): CashRegisterHistory {
  const current = cashRepo.getCurrent(businessId);
  if (!current || current.status === CashRegisterStatus.CERRADA) {
    throw new ValidationError('No hay una caja abierta para cerrar');
  }

  const now = new Date();
  const openDate = new Date(current.openedAt);
  const sales = saleRepo.getByDateRange(businessId, startOfDay(openDate), endOfDay(now));
  const expenses = expenseRepo.getByDateRange(businessId, startOfDay(openDate), endOfDay(now));

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const expectedBalance = current.openingAmount + totalSales - totalExpenses;
  const difference = closingAmount - expectedBalance;

  cashRepo.update(current.id, {
    status: CashRegisterStatus.CERRADA,
    closingAmount,
    closedAt: now,
  });

  return historyRepo.create({
    cashRegisterId: current.id,
    businessId,
    openingAmount: current.openingAmount,
    closingAmount,
    totalSales,
    totalExpenses,
    difference,
    openedAt: current.openedAt,
    closedAt: now,
  });
}

export function getCurrentCashRegister(
  repo: ICashRegisterRepository,
  businessId: string
): CashRegister | null {
  return repo.getCurrent(businessId);
}

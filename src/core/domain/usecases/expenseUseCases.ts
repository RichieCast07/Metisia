import { Expense } from '../entities/Expense';
import { IExpenseRepository } from '../repositories/IExpenseRepository';
import { ValidationError } from '../../shared/errors';

export function createExpense(
  repo: IExpenseRepository,
  data: Omit<Expense, 'id' | 'createdAt'>
): Expense {
  if (!data.description.trim()) throw new ValidationError('La descripción es requerida');
  if (data.amount <= 0) throw new ValidationError('El monto debe ser mayor a 0');
  return repo.create(data);
}

export function deleteExpense(repo: IExpenseRepository, id: string): void {
  repo.delete(id);
}

export function getExpensesByPeriod(
  repo: IExpenseRepository,
  businessId: string,
  from: Date,
  to: Date
): Expense[] {
  return repo.getByDateRange(businessId, from, to);
}

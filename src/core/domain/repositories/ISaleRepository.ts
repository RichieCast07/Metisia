import { Sale } from '../entities/Sale';

export interface ISaleRepository {
  create(sale: Omit<Sale, 'id' | 'createdAt'>): Sale;
  getById(id: string): Sale | null;
  getAll(businessId: string): Sale[];
  getByDateRange(businessId: string, from: Date, to: Date): Sale[];
  delete(id: string): void;
}

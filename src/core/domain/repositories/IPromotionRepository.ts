import { Promotion } from '../entities/Promotion';

export interface IPromotionRepository {
  create(promotion: Omit<Promotion, 'id' | 'createdAt'>): Promotion;
  update(id: string, data: Partial<Promotion>): Promotion;
  delete(id: string): void;
  getById(id: string): Promotion | null;
  getAll(businessId: string): Promotion[];
  getActive(businessId: string): Promotion[];
}

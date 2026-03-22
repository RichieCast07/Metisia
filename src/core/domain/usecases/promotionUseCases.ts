import { Promotion } from '../entities/Promotion';
import { IPromotionRepository } from '../repositories/IPromotionRepository';
import { ValidationError } from '../../shared/errors';

export function createPromotion(
  repo: IPromotionRepository,
  data: Omit<Promotion, 'id' | 'createdAt'>
): Promotion {
  if (!data.name.trim()) throw new ValidationError('El nombre de la promoción es requerido');
  if (data.value <= 0) throw new ValidationError('El valor del descuento debe ser mayor a 0');
  return repo.create(data);
}

export function togglePromotion(
  repo: IPromotionRepository,
  promotionId: string
): Promotion {
  const promotion = repo.getById(promotionId);
  if (!promotion) throw new ValidationError('Promoción no encontrada');
  return repo.update(promotionId, { isActive: !promotion.isActive });
}

export function deletePromotion(
  repo: IPromotionRepository,
  id: string
): void {
  repo.delete(id);
}

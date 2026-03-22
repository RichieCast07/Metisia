import { Ingredient } from '../entities/Ingredient';
import { MovementType } from '../entities/IngredientMovement';
import { IIngredientRepository } from '../repositories/IIngredientRepository';
import { IIngredientMovementRepository } from '../repositories/IIngredientMovementRepository';
import { ValidationError } from '../../shared/errors';

export function createIngredient(
  repo: IIngredientRepository,
  data: Omit<Ingredient, 'id' | 'updatedAt'>
): Ingredient {
  if (!data.name.trim()) throw new ValidationError('El nombre del insumo es requerido');
  if (data.unitCost < 0) throw new ValidationError('El costo unitario no puede ser negativo');
  return repo.create(data);
}

export function updateIngredient(
  repo: IIngredientRepository,
  id: string,
  data: Partial<Ingredient>
): Ingredient {
  return repo.update(id, data);
}

export function adjustStock(
  ingredientRepo: IIngredientRepository,
  movementRepo: IIngredientMovementRepository,
  id: string,
  quantity: number,
  reason: string,
  businessId: string,
  type: MovementType = MovementType.AJUSTE
): void {
  const ingredient = ingredientRepo.getById(id);
  if (!ingredient) throw new ValidationError('Insumo no encontrado');

  const newStock = type === MovementType.SALIDA
    ? ingredient.stock - quantity
    : ingredient.stock + quantity;

  if (newStock < 0) throw new ValidationError('El stock no puede ser negativo');

  ingredientRepo.updateStock(id, newStock);
  movementRepo.create({
    businessId,
    ingredientId: id,
    type,
    quantity,
    reason,
    date: new Date(),
  });
}

export function getLowStockIngredients(
  repo: IIngredientRepository,
  businessId: string
): Ingredient[] {
  return repo.getAll(businessId).filter(i => i.stock <= i.minStock);
}

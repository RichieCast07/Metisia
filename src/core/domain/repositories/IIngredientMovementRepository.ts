import { IngredientMovement } from '../entities/IngredientMovement';

export interface IIngredientMovementRepository {
  create(movement: Omit<IngredientMovement, 'id'>): IngredientMovement;
  getByIngredientId(ingredientId: string): IngredientMovement[];
  getByDateRange(businessId: string, from: Date, to: Date): IngredientMovement[];
}

import { Ingredient } from '../entities/Ingredient';

export interface IIngredientRepository {
  create(ingredient: Omit<Ingredient, 'id' | 'updatedAt'>): Ingredient;
  update(id: string, data: Partial<Ingredient>): Ingredient;
  delete(id: string): void;
  getById(id: string): Ingredient | null;
  getAll(businessId: string): Ingredient[];
  updateStock(id: string, newStock: number): void;
}

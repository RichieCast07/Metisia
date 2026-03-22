import { ProductIngredient } from '../entities/ProductIngredient';

export interface IProductIngredientRepository {
  create(data: Omit<ProductIngredient, 'id'>): ProductIngredient;
  delete(id: string): void;
  getByProductId(productId: string): ProductIngredient[];
  getAll(): ProductIngredient[];
}

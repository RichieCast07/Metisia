import { ProductIngredient } from '../entities/ProductIngredient';
import { IProductIngredientRepository } from '../repositories/IProductIngredientRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { IIngredientRepository } from '../repositories/IIngredientRepository';
import { ProductNotFoundError } from '../../shared/errors';
import { ProductAvailability } from '../../shared/types';

export function linkIngredientToProduct(
  repo: IProductIngredientRepository,
  data: Omit<ProductIngredient, 'id'>
): ProductIngredient {
  return repo.create(data);
}

export function removeIngredientFromProduct(
  repo: IProductIngredientRepository,
  id: string
): void {
  repo.delete(id);
}

export function getProductAvailability(
  productRepo: IProductRepository,
  ingredientRepo: IIngredientRepository,
  recipeRepo: IProductIngredientRepository,
  productId: string
): number {
  const product = productRepo.getById(productId);
  if (!product) throw new ProductNotFoundError(productId);

  const recipe = recipeRepo.getByProductId(productId);
  if (recipe.length === 0) return Infinity;

  let maxQuantity = Infinity;
  for (const item of recipe) {
    const ingredient = ingredientRepo.getById(item.ingredientId);
    if (!ingredient) return 0;
    if (item.quantity <= 0) continue;
    const possible = Math.floor(ingredient.stock / item.quantity);
    maxQuantity = Math.min(maxQuantity, possible);
  }

  return maxQuantity === Infinity ? 0 : maxQuantity;
}

export function checkAllProductsAvailability(
  productRepo: IProductRepository,
  ingredientRepo: IIngredientRepository,
  recipeRepo: IProductIngredientRepository,
  businessId: string
): ProductAvailability[] {
  const products = productRepo.getAll(businessId);
  return products.map(product => {
    const recipe = recipeRepo.getByProductId(product.id);
    if (recipe.length === 0) {
      return { productId: product.id, productName: product.name, available: true, maxQuantity: 999, missingIngredients: [] };
    }

    let maxQuantity = Infinity;
    const missing: string[] = [];

    for (const item of recipe) {
      const ingredient = ingredientRepo.getById(item.ingredientId);
      if (!ingredient) {
        maxQuantity = 0;
        missing.push(`Insumo ID: ${item.ingredientId}`);
        continue;
      }
      if (item.quantity <= 0) continue;
      const possible = Math.floor(ingredient.stock / item.quantity);
      if (possible === 0) missing.push(ingredient.name);
      maxQuantity = Math.min(maxQuantity, possible);
    }

    const qty = maxQuantity === Infinity ? 0 : maxQuantity;
    return {
      productId: product.id,
      productName: product.name,
      available: qty > 0,
      maxQuantity: qty,
      missingIngredients: missing,
    };
  });
}

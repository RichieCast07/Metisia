import { v4 as uuidv4 } from 'uuid';
import { ProductIngredient } from '../../core/domain/entities/ProductIngredient';
import { IProductIngredientRepository } from '../../core/domain/repositories/IProductIngredientRepository';
import { storage } from '../storage/StorageAdapter';

const ENTITY = 'product_ingredients';

export class LocalStorageProductIngredientRepository implements IProductIngredientRepository {
  create(data: Omit<ProductIngredient, 'id'>): ProductIngredient {
    const items = storage.getGlobalItems<ProductIngredient>(ENTITY);
    const item: ProductIngredient = { ...data, id: uuidv4() };
    items.push(item);
    storage.setGlobalItems(ENTITY, items);
    return item;
  }

  delete(id: string): void {
    const items = storage.getGlobalItems<ProductIngredient>(ENTITY).filter(i => i.id !== id);
    storage.setGlobalItems(ENTITY, items);
  }

  getByProductId(productId: string): ProductIngredient[] {
    return storage.getGlobalItems<ProductIngredient>(ENTITY).filter(i => i.productId === productId);
  }

  getAll(): ProductIngredient[] {
    return storage.getGlobalItems<ProductIngredient>(ENTITY);
  }
}

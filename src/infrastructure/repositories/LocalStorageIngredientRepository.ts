import { v4 as uuidv4 } from 'uuid';
import { Ingredient } from '../../core/domain/entities/Ingredient';
import { IIngredientRepository } from '../../core/domain/repositories/IIngredientRepository';
import { storage } from '../storage/StorageAdapter';

export class LocalStorageIngredientRepository implements IIngredientRepository {
  create(data: Omit<Ingredient, 'id' | 'updatedAt'>): Ingredient {
    const items = storage.getItems<Ingredient>(data.businessId, 'ingredients');
    const ingredient: Ingredient = { ...data, id: uuidv4(), updatedAt: new Date() };
    items.push(ingredient);
    storage.setItems(data.businessId, 'ingredients', items);
    return ingredient;
  }

  update(id: string, data: Partial<Ingredient>): Ingredient {
    const item = this.getById(id);
    if (!item) throw new Error('Insumo no encontrado');
    const items = storage.getItems<Ingredient>(item.businessId, 'ingredients');
    const index = items.findIndex(i => i.id === id);
    items[index] = { ...items[index], ...data, updatedAt: new Date() };
    storage.setItems(item.businessId, 'ingredients', items);
    return items[index];
  }

  delete(id: string): void {
    const item = this.getById(id);
    if (!item) return;
    const items = storage.getItems<Ingredient>(item.businessId, 'ingredients').filter(i => i.id !== id);
    storage.setItems(item.businessId, 'ingredients', items);
  }

  getById(id: string): Ingredient | null {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_ingredients')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) ?? '[]') as Ingredient[];
          const found = items.find(item => item.id === id);
          if (found) return found;
        } catch { /* skip */ }
      }
    }
    return null;
  }

  getAll(businessId: string): Ingredient[] {
    return storage.getItems<Ingredient>(businessId, 'ingredients');
  }

  updateStock(id: string, newStock: number): void {
    const item = this.getById(id);
    if (!item) return;
    const items = storage.getItems<Ingredient>(item.businessId, 'ingredients');
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], stock: newStock, updatedAt: new Date() };
      storage.setItems(item.businessId, 'ingredients', items);
    }
  }
}

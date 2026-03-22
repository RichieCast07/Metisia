import { v4 as uuidv4 } from 'uuid';
import { IngredientMovement } from '../../core/domain/entities/IngredientMovement';
import { IIngredientMovementRepository } from '../../core/domain/repositories/IIngredientMovementRepository';
import { storage } from '../storage/StorageAdapter';

export class LocalStorageIngredientMovementRepository implements IIngredientMovementRepository {
  create(data: Omit<IngredientMovement, 'id'>): IngredientMovement {
    const items = storage.getItems<IngredientMovement>(data.businessId, 'ingredient_movements');
    const movement: IngredientMovement = { ...data, id: uuidv4() };
    items.push(movement);
    storage.setItems(data.businessId, 'ingredient_movements', items);
    return movement;
  }

  getByIngredientId(ingredientId: string): IngredientMovement[] {
    const all = this.getAllAcross();
    return all.filter(m => m.ingredientId === ingredientId);
  }

  getByDateRange(businessId: string, from: Date, to: Date): IngredientMovement[] {
    const items = storage.getItems<IngredientMovement>(businessId, 'ingredient_movements');
    return items.filter(m => {
      const d = new Date(m.date);
      return d >= from && d <= to;
    });
  }

  private getAllAcross(): IngredientMovement[] {
    const all: IngredientMovement[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_ingredient_movements')) {
        try {
          all.push(...(JSON.parse(localStorage.getItem(key) ?? '[]') as IngredientMovement[]));
        } catch { /* skip */ }
      }
    }
    return all;
  }
}

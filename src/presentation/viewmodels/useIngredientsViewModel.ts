import { useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import { Ingredient, IngredientUnit } from '@/core/domain/entities/Ingredient';
import { createIngredient, updateIngredient, adjustStock } from '@/core/domain/usecases/ingredientUseCases';
import { LocalStorageIngredientRepository } from '@/infrastructure/repositories/LocalStorageIngredientRepository';
import { LocalStorageIngredientMovementRepository } from '@/infrastructure/repositories/LocalStorageIngredientMovementRepository';

const repo = new LocalStorageIngredientRepository();
const movementRepo = new LocalStorageIngredientMovementRepository();

export function useIngredientsViewModel() {
  const user = useAuthStore(s => s.user);
  const businessId = user?.id ?? '';
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAdjust, setShowAdjust] = useState<Ingredient | null>(null);
  const [refresh, setRefresh] = useState(0);

  const ingredients = useMemo(() => repo.getAll(businessId), [businessId, refresh]);

  const filtered = useMemo(() => {
    if (!search.trim()) return ingredients;
    const q = search.toLowerCase();
    return ingredients.filter(i => i.name.toLowerCase().includes(q));
  }, [ingredients, search]);

  const save = useCallback((data: { name: string; unit: IngredientUnit; stock: number; minStock: number; unitCost: number }) => {
    if (editing) {
      updateIngredient(repo, editing.id, data);
    } else {
      createIngredient(repo, { ...data, businessId });
    }
    setShowForm(false);
    setEditing(null);
    setRefresh(r => r + 1);
  }, [editing, businessId]);

  const remove = useCallback((_id: string) => {
    // Ingredient delete not supported via use case; could add if needed
    setRefresh(r => r + 1);
  }, []);

  const doAdjust = useCallback((ingredientId: string, quantity: number, reason: string) => {
    adjustStock(repo, movementRepo, ingredientId, Math.abs(quantity), reason, businessId);
    setShowAdjust(null);
    setRefresh(r => r + 1);
  }, [businessId]);

  return {
    ingredients: filtered, search, setSearch, editing, showForm, showAdjust, setShowAdjust,
    save, remove, doAdjust,
    openCreate: () => { setEditing(null); setShowForm(true); },
    openEdit: (i: Ingredient) => { setEditing(i); setShowForm(true); },
    closeForm: () => { setShowForm(false); setEditing(null); },
  };
}

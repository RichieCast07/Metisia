import { useState, useCallback, useEffect } from 'react';
import { ingredientApi, ApiIngredient } from '@/infrastructure/api/ingredientApi';

export function useIngredientsViewModel() {
  const [ingredients, setIngredients] = useState<ApiIngredient[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<ApiIngredient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAdjust, setShowAdjust] = useState<ApiIngredient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ingredientApi.list();
      setIngredients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ingredientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = search.trim()
    ? ingredients.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
      )
    : ingredients;

  const save = useCallback(async (data: Omit<ApiIngredient, 'id' | 'business_id' | 'updated_at'>) => {
    try {
      if (editing) {
        await ingredientApi.update(editing.id, data);
      } else {
        await ingredientApi.create(data);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  }, [editing, load]);

  const remove = useCallback(async (id: string) => {
    try {
      await ingredientApi.delete(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }, [load]);

  const openCreate = useCallback(() => { setEditing(null); setShowForm(true); }, []);
  const openEdit = useCallback((i: ApiIngredient) => { setEditing(i); setShowForm(true); }, []);
  const closeForm = useCallback(() => { setShowForm(false); setEditing(null); }, []);

  const doAdjust = useCallback(async (id: string, qty: number, _reason: string) => {
    const target = ingredients.find(i => i.id === id);
    if (!target) return;
    try {
      await ingredientApi.update(id, { stock: target.stock + qty });
      setShowAdjust(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ajustar stock');
    }
  }, [ingredients, load]);

  return {
    ingredients: filtered,
    search,
    setSearch,
    editing,
    showForm,
    showAdjust,
    setShowAdjust,
    isLoading,
    error,
    save,
    remove,
    openCreate,
    openEdit,
    closeForm,
    doAdjust,
  };
}

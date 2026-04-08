import { useState, useCallback, useEffect } from 'react';
import { productApi, ApiProduct } from '@/infrastructure/api/productApi';

export function useProductsViewModel() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productApi.list();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = search.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const save = useCallback(async (data: {
    name: string;
    category: string;
    price: number;
    is_active: boolean;
    description?: string;
  }) => {
    try {
      if (editing) {
        await productApi.update(editing.id, data);
      } else {
        await productApi.create(data);
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
      await productApi.delete(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }, [load]);

  const toggleActive = useCallback(async (product: ApiProduct) => {
    try {
      await productApi.update(product.id, { is_active: !product.is_active });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  }, [load]);

  const openCreate = useCallback(() => { setEditing(null); setShowForm(true); }, []);
  const openEdit = useCallback((p: ApiProduct) => { setEditing(p); setShowForm(true); }, []);
  const closeForm = useCallback(() => { setShowForm(false); setEditing(null); }, []);

  return {
    products: filtered,
    search,
    setSearch,
    editing,
    showForm,
    isLoading,
    error,
    save,
    remove,
    toggleActive,
    openCreate,
    openEdit,
    closeForm,
  };
}

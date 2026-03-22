import { useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import { Product } from '@/core/domain/entities/Product';
import { createProduct, updateProduct, deleteProduct } from '@/core/domain/usecases/productUseCases';
import { LocalStorageProductRepository } from '@/infrastructure/repositories/LocalStorageProductRepository';

const repo = new LocalStorageProductRepository();

export function useProductsViewModel() {
  const user = useAuthStore(s => s.user);
  const businessId = user?.id ?? '';
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const products = useMemo(() => repo.getAll(businessId), [businessId, refresh]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [products, search]);

  const save = useCallback((data: { name: string; category: string; price: number; isActive: boolean }) => {
    if (editing) {
      updateProduct(repo, editing.id, data);
    } else {
      createProduct(repo, { ...data, businessId });
    }
    setShowForm(false);
    setEditing(null);
    setRefresh(r => r + 1);
  }, [editing, businessId]);

  const remove = useCallback((id: string) => {
    deleteProduct(repo, id);
    setRefresh(r => r + 1);
  }, []);

  const toggleActive = useCallback((product: Product) => {
    updateProduct(repo, product.id, { isActive: !product.isActive });
    setRefresh(r => r + 1);
  }, []);

  const openCreate = useCallback(() => { setEditing(null); setShowForm(true); }, []);
  const openEdit = useCallback((p: Product) => { setEditing(p); setShowForm(true); }, []);
  const closeForm = useCallback(() => { setShowForm(false); setEditing(null); }, []);

  return { products: filtered, search, setSearch, editing, showForm, save, remove, toggleActive, openCreate, openEdit, closeForm };
}

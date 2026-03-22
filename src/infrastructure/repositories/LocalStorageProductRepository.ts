import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../core/domain/entities/Product';
import { IProductRepository } from '../../core/domain/repositories/IProductRepository';
import { storage } from '../storage/StorageAdapter';

export class LocalStorageProductRepository implements IProductRepository {
  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const items = storage.getItems<Product>(data.businessId, 'products');
    const product: Product = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    items.push(product);
    storage.setItems(data.businessId, 'products', items);
    return product;
  }

  update(id: string, data: Partial<Product>): Product {
    const all = this.findAllAcross();
    const item = all.find(p => p.id === id);
    if (!item) throw new Error('Producto no encontrado');
    const items = storage.getItems<Product>(item.businessId, 'products');
    const index = items.findIndex(p => p.id === id);
    items[index] = { ...items[index], ...data, updatedAt: new Date() };
    storage.setItems(item.businessId, 'products', items);
    return items[index];
  }

  delete(id: string): void {
    const all = this.findAllAcross();
    const item = all.find(p => p.id === id);
    if (!item) return;
    const items = storage.getItems<Product>(item.businessId, 'products').filter(p => p.id !== id);
    storage.setItems(item.businessId, 'products', items);
  }

  getById(id: string): Product | null {
    return this.findAllAcross().find(p => p.id === id) ?? null;
  }

  getAll(businessId: string): Product[] {
    return storage.getItems<Product>(businessId, 'products');
  }

  private findAllAcross(): Product[] {
    // Search across known business storages
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_products')) keys.push(key);
    }
    const all: Product[] = [];
    for (const key of keys) {
      try {
        const items = JSON.parse(localStorage.getItem(key) ?? '[]') as Product[];
        all.push(...items);
      } catch { /* skip */ }
    }
    return all;
  }
}

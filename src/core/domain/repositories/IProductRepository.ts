import { Product } from '../entities/Product';

export interface IProductRepository {
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product;
  update(id: string, data: Partial<Product>): Product;
  delete(id: string): void;
  getById(id: string): Product | null;
  getAll(businessId: string): Product[];
}

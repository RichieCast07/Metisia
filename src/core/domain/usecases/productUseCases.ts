import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';
import { ValidationError } from '../../shared/errors';

export function createProduct(
  repo: IProductRepository,
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Product {
  if (!data.name.trim()) throw new ValidationError('El nombre del producto es requerido');
  if (data.price <= 0) throw new ValidationError('El precio debe ser mayor a 0');
  return repo.create(data);
}

export function updateProduct(
  repo: IProductRepository,
  id: string,
  data: Partial<Product>
): Product {
  return repo.update(id, data);
}

export function deleteProduct(repo: IProductRepository, id: string): void {
  repo.delete(id);
}

export function getProducts(repo: IProductRepository, businessId: string): Product[] {
  return repo.getAll(businessId);
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

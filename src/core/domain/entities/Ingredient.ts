export enum IngredientUnit {
  KG = 'kg',
  G = 'g',
  L = 'l',
  ML = 'ml',
  PZA = 'pza',
  CAJA = 'caja',
}

export interface Ingredient {
  id: string;
  businessId: string;
  name: string;
  unit: IngredientUnit;
  stock: number;
  minStock: number;
  unitCost: number;
  supplier?: string;
  updatedAt: Date;
}

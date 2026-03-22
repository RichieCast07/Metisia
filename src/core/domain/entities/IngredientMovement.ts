export enum MovementType {
  ENTRADA = 'entrada',
  SALIDA = 'salida',
  AJUSTE = 'ajuste',
}

export interface IngredientMovement {
  id: string;
  businessId: string;
  ingredientId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  date: Date;
}

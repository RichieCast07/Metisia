export enum PromotionType {
  PORCENTAJE = 'porcentaje',
  MONTO_FIJO = 'monto_fijo',
  DOS_POR_UNO = '2x1',
}

export enum PromotionScope {
  TODO = 'todo',
  CATEGORIA = 'categoria',
  PRODUCTO = 'producto',
}

export interface Promotion {
  id: string;
  businessId: string;
  name: string;
  type: PromotionType;
  value: number;
  applicableTo: PromotionScope;
  targetId?: string;
  isActive: boolean;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
}

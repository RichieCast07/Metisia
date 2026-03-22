export enum ExpenseCategory {
  INSUMOS = 'insumos',
  RENTA = 'renta',
  SERVICIOS = 'servicios',
  NOMINA = 'nomina',
  MARKETING = 'marketing',
  OTRO = 'otro',
}

export interface Expense {
  id: string;
  businessId: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  createdAt: Date;
}

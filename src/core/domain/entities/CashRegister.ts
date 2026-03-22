export enum CashRegisterStatus {
  ABIERTA = 'abierta',
  CERRADA = 'cerrada',
}

export interface CashRegister {
  id: string;
  businessId: string;
  status: CashRegisterStatus;
  openingAmount: number;
  closingAmount?: number;
  openedAt: Date;
  closedAt?: Date;
  openedBy: string;
}

export interface CashRegisterHistory {
  id: string;
  cashRegisterId: string;
  businessId: string;
  openingAmount: number;
  closingAmount: number;
  totalSales: number;
  totalExpenses: number;
  difference: number;
  openedAt: Date;
  closedAt: Date;
}

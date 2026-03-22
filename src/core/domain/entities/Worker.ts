export interface Worker {
  id: string;
  businessId: string;
  name: string;
  role: string;
  phone?: string;
  dailyRate?: number;
  isActive: boolean;
  hiredAt: Date;
}

export interface WorkerParticipation {
  id: string;
  saleId: string;
  workerId: string;
  percentage: number;
}

export enum WorkerPaymentType {
  AUTOMATICO = 'automatico',
  MANUAL = 'manual',
}

export interface WorkerPayment {
  id: string;
  businessId: string;
  workerId: string;
  amount: number;
  type: WorkerPaymentType;
  period?: string;
  notes?: string;
  paidAt: Date;
}

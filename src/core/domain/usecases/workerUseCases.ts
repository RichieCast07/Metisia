import { Worker, WorkerPayment, WorkerPaymentType } from '../entities/Worker';
import { IWorkerRepository, IWorkerParticipationRepository, IWorkerPaymentRepository } from '../repositories/IWorkerRepository';
import { ISaleRepository } from '../repositories/ISaleRepository';
import { ValidationError } from '../../shared/errors';
import { WorkerEarningsReport } from '../../shared/types';

export function createWorker(
  repo: IWorkerRepository,
  data: Omit<Worker, 'id' | 'hiredAt'>
): Worker {
  if (!data.name.trim()) throw new ValidationError('El nombre del trabajador es requerido');
  return repo.create(data);
}

export function toggleWorkerStatus(
  repo: IWorkerRepository,
  workerId: string
): Worker {
  const worker = repo.getById(workerId);
  if (!worker) throw new ValidationError('Trabajador no encontrado');
  return repo.update(workerId, { isActive: !worker.isActive });
}

export function registerWorkerPayment(
  repo: IWorkerPaymentRepository,
  data: Omit<WorkerPayment, 'id'>
): WorkerPayment {
  if (data.amount <= 0) throw new ValidationError('El monto del pago debe ser mayor a 0');
  return repo.create(data);
}

export function getWorkerEarnings(
  saleRepo: ISaleRepository,
  participationRepo: IWorkerParticipationRepository,
  paymentRepo: IWorkerPaymentRepository,
  workerRepo: IWorkerRepository,
  workerId: string,
  from: Date,
  to: Date,
  businessId: string
): WorkerEarningsReport {
  const worker = workerRepo.getById(workerId);
  if (!worker) throw new ValidationError('Trabajador no encontrado');

  const sales = saleRepo.getByDateRange(businessId, from, to);
  const participations = participationRepo.getByWorkerId(workerId);
  const payments = paymentRepo.getByWorkerId(workerId);

  const workerSales = sales.filter(s =>
    participations.some(p => p.saleId === s.id)
  );

  const totalCommission = workerSales.reduce((sum, sale) => {
    const participation = participations.find(p => p.saleId === sale.id);
    return sum + (sale.total * (participation?.percentage ?? 0) / 100);
  }, 0);

  const totalPaid = payments
    .filter(p => {
      const paidDate = new Date(p.paidAt);
      return paidDate >= from && paidDate <= to;
    })
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    workerId,
    workerName: worker.name,
    salesAttended: workerSales.length,
    totalCommission,
    totalPaid,
    pendingBalance: totalCommission - totalPaid,
  };
}

export function createManualPayment(
  repo: IWorkerPaymentRepository,
  businessId: string,
  workerId: string,
  amount: number,
  notes?: string
): WorkerPayment {
  return repo.create({
    businessId,
    workerId,
    amount,
    type: WorkerPaymentType.MANUAL,
    notes,
    paidAt: new Date(),
  });
}

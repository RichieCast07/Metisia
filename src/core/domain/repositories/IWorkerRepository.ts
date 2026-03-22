import { Worker, WorkerParticipation, WorkerPayment } from '../entities/Worker';

export interface IWorkerRepository {
  create(worker: Omit<Worker, 'id' | 'hiredAt'>): Worker;
  update(id: string, data: Partial<Worker>): Worker;
  getById(id: string): Worker | null;
  getAll(businessId: string): Worker[];
  getActive(businessId: string): Worker[];
}

export interface IWorkerParticipationRepository {
  create(participation: Omit<WorkerParticipation, 'id'>): WorkerParticipation;
  getBySaleId(saleId: string): WorkerParticipation[];
  getByWorkerId(workerId: string): WorkerParticipation[];
}

export interface IWorkerPaymentRepository {
  create(payment: Omit<WorkerPayment, 'id'>): WorkerPayment;
  getByWorkerId(workerId: string): WorkerPayment[];
  getAll(businessId: string): WorkerPayment[];
}

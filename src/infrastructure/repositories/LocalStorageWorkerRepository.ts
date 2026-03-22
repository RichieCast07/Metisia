import { v4 as uuidv4 } from 'uuid';
import { Worker, WorkerParticipation, WorkerPayment } from '../../core/domain/entities/Worker';
import { IWorkerRepository, IWorkerParticipationRepository, IWorkerPaymentRepository } from '../../core/domain/repositories/IWorkerRepository';
import { storage } from '../storage/StorageAdapter';

export class LocalStorageWorkerRepository implements IWorkerRepository {
  create(data: Omit<Worker, 'id' | 'hiredAt'>): Worker {
    const items = storage.getItems<Worker>(data.businessId, 'workers');
    const worker: Worker = { ...data, id: uuidv4(), hiredAt: new Date() };
    items.push(worker);
    storage.setItems(data.businessId, 'workers', items);
    return worker;
  }

  update(id: string, data: Partial<Worker>): Worker {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_workers') && !key.includes('_worker_')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) ?? '[]') as Worker[];
          const index = items.findIndex(w => w.id === id);
          if (index !== -1) {
            items[index] = { ...items[index], ...data };
            localStorage.setItem(key, JSON.stringify(items));
            return items[index];
          }
        } catch { /* skip */ }
      }
    }
    throw new Error('Trabajador no encontrado');
  }

  getById(id: string): Worker | null {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_workers') && !key.includes('_worker_')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) ?? '[]') as Worker[];
          const found = items.find(w => w.id === id);
          if (found) return found;
        } catch { /* skip */ }
      }
    }
    return null;
  }

  getAll(businessId: string): Worker[] {
    return storage.getItems<Worker>(businessId, 'workers');
  }

  getActive(businessId: string): Worker[] {
    return this.getAll(businessId).filter(w => w.isActive);
  }
}

export class LocalStorageWorkerParticipationRepository implements IWorkerParticipationRepository {
  create(data: Omit<WorkerParticipation, 'id'>): WorkerParticipation {
    const items = storage.getGlobalItems<WorkerParticipation>('worker_participations');
    const item: WorkerParticipation = { ...data, id: uuidv4() };
    items.push(item);
    storage.setGlobalItems('worker_participations', items);
    return item;
  }

  getBySaleId(saleId: string): WorkerParticipation[] {
    return storage.getGlobalItems<WorkerParticipation>('worker_participations').filter(p => p.saleId === saleId);
  }

  getByWorkerId(workerId: string): WorkerParticipation[] {
    return storage.getGlobalItems<WorkerParticipation>('worker_participations').filter(p => p.workerId === workerId);
  }
}

export class LocalStorageWorkerPaymentRepository implements IWorkerPaymentRepository {
  create(data: Omit<WorkerPayment, 'id'>): WorkerPayment {
    const items = storage.getItems<WorkerPayment>(data.businessId, 'worker_payments');
    const payment: WorkerPayment = { ...data, id: uuidv4() };
    items.push(payment);
    storage.setItems(data.businessId, 'worker_payments', items);
    return payment;
  }

  getByWorkerId(workerId: string): WorkerPayment[] {
    const all: WorkerPayment[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_worker_payments')) {
        try {
          all.push(...(JSON.parse(localStorage.getItem(key) ?? '[]') as WorkerPayment[]));
        } catch { /* skip */ }
      }
    }
    return all.filter(p => p.workerId === workerId);
  }

  getAll(businessId: string): WorkerPayment[] {
    return storage.getItems<WorkerPayment>(businessId, 'worker_payments');
  }
}

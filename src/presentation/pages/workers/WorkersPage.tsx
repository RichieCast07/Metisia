import { useState, useCallback, useMemo, FormEvent } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import { Plus, Power, DollarSign } from 'lucide-react';
import Header from '@/presentation/components/layout/Header';
import Button from '@/presentation/components/ui/Button';
import DataTable from '@/presentation/components/ui/DataTable';
import Badge from '@/presentation/components/ui/Badge';
import Modal from '@/presentation/components/ui/Modal';
import Input from '@/presentation/components/ui/Input';
import EmptyState from '@/presentation/components/ui/EmptyState';
import { Worker } from '@/core/domain/entities/Worker';
import { createWorker, toggleWorkerStatus, registerWorkerPayment } from '@/core/domain/usecases/workerUseCases';
import { LocalStorageWorkerRepository, LocalStorageWorkerPaymentRepository } from '@/infrastructure/repositories/LocalStorageWorkerRepository';
import { WorkerPaymentType } from '@/core/domain/entities/Worker';

const workerRepo = new LocalStorageWorkerRepository();
const paymentRepo = new LocalStorageWorkerPaymentRepository();

export default function WorkersPage() {
  const user = useAuthStore(s => s.user);
  const businessId = user?.id ?? '';
  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState<Worker | null>(null);
  const [refresh, setRefresh] = useState(0);

  const workers = useMemo(() => workerRepo.getAll(businessId), [businessId, refresh]);

  const handleCreate = useCallback((data: { name: string; role: string; dailyRate: number }) => {
    createWorker(workerRepo, { ...data, businessId, isActive: true });
    setShowForm(false);
    setRefresh(r => r + 1);
  }, [businessId]);

  const handleToggle = useCallback((id: string) => {
    toggleWorkerStatus(workerRepo, id);
    setRefresh(r => r + 1);
  }, []);

  const handlePayment = useCallback((workerId: string, amount: number, notes: string) => {
    registerWorkerPayment(paymentRepo, { businessId, workerId, amount, notes, type: WorkerPaymentType.MANUAL, paidAt: new Date() });
    setShowPayment(null);
    setRefresh(r => r + 1);
  }, [businessId]);

  return (
    <>
      <Header title="Trabajadores" subtitle="Gestión de personal" actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Nuevo Trabajador</Button>} />
      <div className="p-8">
        {workers.length === 0 ? (
          <EmptyState title="Sin trabajadores" description="Registra a tu equipo de trabajo" action={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Agregar</Button>} />
        ) : (
          <DataTable
            data={workers}
            keyExtractor={w => w.id}
            columns={[
              { key: 'name', header: 'Nombre', render: (w: Worker) => <span className="font-medium">{w.name}</span> },
              { key: 'role', header: 'Rol', render: (w: Worker) => <Badge>{w.role}</Badge> },
              { key: 'dailyRate', header: 'Tarifa Diaria', render: (w: Worker) => w.dailyRate ? `$${w.dailyRate}` : '—' },
              { key: 'status', header: 'Estado', render: (w: Worker) => <Badge variant={w.isActive ? 'success' : 'error'}>{w.isActive ? 'Activo' : 'Inactivo'}</Badge> },
              { key: 'actions', header: '', render: (w: Worker) => (
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowPayment(w)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors" title="Registrar pago"><DollarSign size={15} /></button>
                  <button onClick={() => handleToggle(w.id)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors"><Power size={15} /></button>
                </div>
              )},
            ]}
          />
        )}
      </div>

      <WorkerFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleCreate} />
      <PaymentModal worker={showPayment} onClose={() => setShowPayment(null)} onSave={handlePayment} />
    </>
  );
}

function WorkerFormModal({ isOpen, onClose, onSave }: {
  isOpen: boolean; onClose: () => void;
  onSave: (data: { name: string; role: string; dailyRate: number }) => void;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rate, setRate] = useState('0');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ name, role, dailyRate: parseFloat(rate) || 0 });
    setName(''); setRole(''); setRate('0');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Trabajador">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <Input label="Rol" value={role} onChange={e => setRole(e.target.value)} required placeholder="Ej: Panadero, Cajero" />
        <Input label="Tarifa Diaria" type="number" step="0.01" min="0" value={rate} onChange={e => setRate(e.target.value)} />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Crear</Button>
        </div>
      </form>
    </Modal>
  );
}

function PaymentModal({ worker, onClose, onSave }: {
  worker: Worker | null; onClose: () => void;
  onSave: (workerId: string, amount: number, notes: string) => void;
}) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  if (!worker) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(worker.id, parseFloat(amount) || 0, notes);
    setAmount(''); setNotes('');
  };

  return (
    <Modal isOpen onClose={onClose} title={`Pago a ${worker.name}`} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Monto" type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} required />
        <Input label="Notas" value={notes} onChange={e => setNotes(e.target.value)} required placeholder="Ej: Sueldo semanal" />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Registrar Pago</Button>
        </div>
      </form>
    </Modal>
  );
}

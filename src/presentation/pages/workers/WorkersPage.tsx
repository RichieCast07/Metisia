import { useState, useCallback, useEffect, FormEvent } from 'react';
import { Plus, Power, DollarSign } from 'lucide-react';
import Header from '@/presentation/components/layout/Header';
import Button from '@/presentation/components/ui/Button';
import DataTable from '@/presentation/components/ui/DataTable';
import Badge from '@/presentation/components/ui/Badge';
import Modal from '@/presentation/components/ui/Modal';
import Input from '@/presentation/components/ui/Input';
import EmptyState from '@/presentation/components/ui/EmptyState';
import { workerApi, ApiWorker } from '@/infrastructure/api/workerApi';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<ApiWorker[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState<ApiWorker | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await workerApi.list();
      setWorkers(data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = useCallback(async (data: { name: string; role: string; daily_rate: number }) => {
    try {
      await workerApi.create({ ...data, is_active: true, hired_at: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      await load();
    } catch { /* silent */ }
  }, [load]);

  const handleToggle = useCallback(async (id: string) => {
    try {
      await workerApi.toggle(id);
      await load();
    } catch { /* silent */ }
  }, [load]);

  const handlePayment = useCallback(async (workerId: string, amount: number, notes: string) => {
    try {
      await workerApi.registerPayment(workerId, { amount, notes, paid_at: new Date().toISOString() });
      setShowPayment(null);
    } catch { /* silent */ }
  }, []);

  return (
    <>
      <Header title="Trabajadores" subtitle="Gestión de personal" actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Nuevo Trabajador</Button>} />
      <div className="p-8 space-y-6">
        {workers.length === 0 ? (
          <EmptyState title="Sin trabajadores" description="Registra a tu equipo de trabajo" action={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Agregar</Button>} />
        ) : (
          <DataTable
            data={workers}
            keyExtractor={w => w.id}
            columns={[
              { key: 'name', header: 'Nombre', render: (w: ApiWorker) => <span className="font-medium">{w.name}</span> },
              { key: 'role', header: 'Rol', render: (w: ApiWorker) => <Badge>{w.role}</Badge> },
              { key: 'daily_rate', header: 'Tarifa Diaria', render: (w: ApiWorker) => w.daily_rate ? `$${w.daily_rate}` : '—' },
              { key: 'status', header: 'Estado', render: (w: ApiWorker) => <Badge variant={w.is_active ? 'success' : 'error'}>{w.is_active ? 'Activo' : 'Inactivo'}</Badge> },
              { key: 'actions', header: '', render: (w: ApiWorker) => (
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowPayment(w)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" title="Registrar pago"><DollarSign size={15} /></button>
                  <button onClick={() => handleToggle(w.id)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"><Power size={15} /></button>
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
  onSave: (data: { name: string; role: string; daily_rate: number }) => void;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rate, setRate] = useState('0');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ name, role, daily_rate: parseFloat(rate) || 0 });
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
  worker: ApiWorker | null; onClose: () => void;
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
    <Modal isOpen onClose={onClose} title={`Pago: ${worker.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Monto" type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} required />
        <Input label="Notas" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Opcional" />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Registrar</Button>
        </div>
      </form>
    </Modal>
  );
}

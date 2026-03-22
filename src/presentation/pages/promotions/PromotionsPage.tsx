import { useState, useCallback, useMemo, FormEvent } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import { Plus, Trash2, Power } from 'lucide-react';
import Header from '@/presentation/components/layout/Header';
import Button from '@/presentation/components/ui/Button';
import DataTable from '@/presentation/components/ui/DataTable';
import Badge from '@/presentation/components/ui/Badge';
import Modal from '@/presentation/components/ui/Modal';
import Input from '@/presentation/components/ui/Input';
import Select from '@/presentation/components/ui/Select';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog';
import EmptyState from '@/presentation/components/ui/EmptyState';
import { Promotion, PromotionType, PromotionScope } from '@/core/domain/entities/Promotion';
import { createPromotion, togglePromotion, deletePromotion } from '@/core/domain/usecases/promotionUseCases';
import { LocalStoragePromotionRepository } from '@/infrastructure/repositories/LocalStoragePromotionRepository';
import { format } from 'date-fns';

const repo = new LocalStoragePromotionRepository();

export default function PromotionsPage() {
  const user = useAuthStore(s => s.user);
  const businessId = user?.id ?? '';
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const promotions = useMemo(() => repo.getAll(businessId), [businessId, refresh]);

  const handleCreate = useCallback((data: { name: string; type: PromotionType; value: number; applicableTo: PromotionScope }) => {
    createPromotion(repo, { ...data, businessId, isActive: true });
    setShowForm(false);
    setRefresh(r => r + 1);
  }, [businessId]);

  const handleToggle = useCallback((id: string) => {
    togglePromotion(repo, id);
    setRefresh(r => r + 1);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deletePromotion(repo, id);
    setRefresh(r => r + 1);
  }, []);

  return (
    <>
      <Header title="Promociones" subtitle="Gestión de descuentos y ofertas" actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Nueva Promoción</Button>} />
      <div className="p-8">
        {promotions.length === 0 ? (
          <EmptyState title="Sin promociones" description="Crea promociones para atraer más clientes" action={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Crear promoción</Button>} />
        ) : (
          <DataTable
            data={promotions}
            keyExtractor={p => p.id}
            columns={[
              { key: 'name', header: 'Nombre', render: (p: Promotion) => <span className="font-medium">{p.name}</span> },
              { key: 'type', header: 'Tipo', render: (p: Promotion) => <Badge>{p.type}</Badge> },
              { key: 'value', header: 'Valor', render: (p: Promotion) => p.type === PromotionType.PORCENTAJE ? `${p.value}%` : p.type === PromotionType.MONTO_FIJO ? `$${p.value}` : '2x1' },
              { key: 'scope', header: 'Alcance', render: (p: Promotion) => <Badge variant="info">{p.applicableTo}</Badge> },
              { key: 'status', header: 'Estado', render: (p: Promotion) => <Badge variant={p.isActive ? 'success' : 'error'}>{p.isActive ? 'Activa' : 'Inactiva'}</Badge> },
              { key: 'created', header: 'Creada', render: (p: Promotion) => format(new Date(p.createdAt), 'dd/MM/yyyy') },
              { key: 'actions', header: '', render: (p: Promotion) => (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggle(p.id)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors"><Power size={15} /></button>
                  <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-error/5 text-neutral-400 hover:text-error cursor-pointer transition-colors"><Trash2 size={15} /></button>
                </div>
              )},
            ]}
          />
        )}
      </div>
      <PromotionFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleCreate} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) handleDelete(deleteId); }} title="Eliminar promoción" message="¿Eliminar esta promoción?" />
    </>
  );
}

function PromotionFormModal({ isOpen, onClose, onSave }: {
  isOpen: boolean; onClose: () => void;
  onSave: (data: { name: string; type: PromotionType; value: number; applicableTo: PromotionScope }) => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<PromotionType>(PromotionType.PORCENTAJE);
  const [value, setValue] = useState('');
  const [scope, setScope] = useState<PromotionScope>(PromotionScope.TODO);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ name, type, value: parseFloat(value) || 0, applicableTo: scope });
    setName(''); setValue('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Promoción">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej: 20% en todo" />
        <Select label="Tipo" options={Object.values(PromotionType).map(t => ({ value: t, label: t }))} value={type} onChange={e => setType(e.target.value as PromotionType)} />
        <Input label="Valor" type="number" step="0.01" min="0" value={value} onChange={e => setValue(e.target.value)} required />
        <Select label="Alcance" options={Object.values(PromotionScope).map(s => ({ value: s, label: s }))} value={scope} onChange={e => setScope(e.target.value as PromotionScope)} />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Crear</Button>
        </div>
      </form>
    </Modal>
  );
}

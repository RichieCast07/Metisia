import { useState, useCallback, useEffect, FormEvent } from 'react';
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
import { promotionApi, ApiPromotion } from '@/infrastructure/api/promotionApi';
import { PromotionType, PromotionScope } from '@/core/domain/entities/Promotion';
import { format } from 'date-fns';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await promotionApi.list();
      setPromotions(data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = useCallback(async (data: { name: string; type: string; value: number; applicable_to: string }) => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0];
    try {
      await promotionApi.create({ ...data, is_active: true, starts_at: today, ends_at: nextYear });
      setShowForm(false);
      await load();
    } catch { /* silent */ }
  }, [load]);

  const handleToggle = useCallback(async (id: string) => {
    try {
      await promotionApi.toggle(id);
      await load();
    } catch { /* silent */ }
  }, [load]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await promotionApi.delete(id);
      setDeleteId(null);
      await load();
    } catch { /* silent */ }
  }, [load]);

  return (
    <>
      <Header title="Promociones" subtitle="Gestión de descuentos y ofertas" actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Nueva Promoción</Button>} />
      <div className="p-8 space-y-6">
        {promotions.length === 0 ? (
          <EmptyState title="Sin promociones" description="Crea promociones para atraer más clientes" action={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Crear promoción</Button>} />
        ) : (
          <DataTable
            data={promotions}
            keyExtractor={p => p.id}
            columns={[
              { key: 'name', header: 'Nombre', render: (p: ApiPromotion) => <span className="font-medium">{p.name}</span> },
              { key: 'type', header: 'Tipo', render: (p: ApiPromotion) => <Badge>{p.type}</Badge> },
              { key: 'value', header: 'Valor', render: (p: ApiPromotion) => p.type === PromotionType.PORCENTAJE ? `${p.value}%` : p.type === PromotionType.MONTO_FIJO ? `$${p.value}` : '2x1' },
              { key: 'scope', header: 'Alcance', render: (p: ApiPromotion) => <Badge variant="info">{p.applicable_to}</Badge> },
              { key: 'status', header: 'Estado', render: (p: ApiPromotion) => <Badge variant={p.is_active ? 'success' : 'error'}>{p.is_active ? 'Activa' : 'Inactiva'}</Badge> },
              { key: 'created', header: 'Creada', render: (p: ApiPromotion) => format(new Date(p.created_at), 'dd/MM/yyyy') },
              { key: 'actions', header: '', render: (p: ApiPromotion) => (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggle(p.id)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"><Power size={15} /></button>
                  <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"><Trash2 size={15} /></button>
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
  onSave: (data: { name: string; type: string; value: number; applicable_to: string }) => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<string>(PromotionType.PORCENTAJE);
  const [value, setValue] = useState('');
  const [scope, setScope] = useState<string>(PromotionScope.TODO);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ name, type, value: parseFloat(value) || 0, applicable_to: scope });
    setName(''); setValue('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Promoción">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej: 20% en todo" />
        <Select label="Tipo" options={Object.values(PromotionType).map(t => ({ value: t, label: t }))} value={type} onChange={e => setType(e.target.value)} />
        <Input label="Valor" type="number" step="0.01" min="0" value={value} onChange={e => setValue(e.target.value)} required />
        <Select label="Alcance" options={Object.values(PromotionScope).map(s => ({ value: s, label: s }))} value={scope} onChange={e => setScope(e.target.value)} />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Crear</Button>
        </div>
      </form>
    </Modal>
  );
}

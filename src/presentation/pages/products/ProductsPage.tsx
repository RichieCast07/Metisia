import { Plus, Pencil, Trash2, Power } from 'lucide-react';
import Header from '@/presentation/components/layout/Header';
import Button from '@/presentation/components/ui/Button';
import SearchInput from '@/presentation/components/ui/SearchInput';
import DataTable from '@/presentation/components/ui/DataTable';
import Badge from '@/presentation/components/ui/Badge';
import Modal from '@/presentation/components/ui/Modal';
import Input from '@/presentation/components/ui/Input';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog';
import EmptyState from '@/presentation/components/ui/EmptyState';
import { useProductsViewModel } from '@/presentation/viewmodels/useProductsViewModel';
import { Product } from '@/core/domain/entities/Product';
import { useState, FormEvent } from 'react';

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

export default function ProductsPage() {
  const vm = useProductsViewModel();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      <Header title="Productos" subtitle="Gestión de catálogo" actions={<Button size="sm" onClick={vm.openCreate}><Plus size={16} /> Nuevo Producto</Button>} />
      <div className="p-8 space-y-6">
        <SearchInput value={vm.search} onChange={vm.setSearch} placeholder="Buscar por nombre o categoría..." />

        {vm.products.length === 0 ? (
          <EmptyState title="Sin productos" description="Crea tu primer producto para comenzar" action={<Button size="sm" onClick={vm.openCreate}><Plus size={16} /> Crear producto</Button>} />
        ) : (
          <DataTable
            data={vm.products}
            keyExtractor={p => p.id}
            columns={[
              { key: 'name', header: 'Nombre', render: (p: Product) => <span className="font-medium">{p.name}</span> },
              { key: 'category', header: 'Categoría', render: (p: Product) => <Badge>{p.category}</Badge> },
              { key: 'price', header: 'Precio', render: (p: Product) => fmt(p.price) },

              { key: 'status', header: 'Estado', render: (p: Product) => <Badge variant={p.isActive ? 'success' : 'error'}>{p.isActive ? 'Activo' : 'Inactivo'}</Badge> },
              { key: 'actions', header: '', render: (p: Product) => (
                <div className="flex items-center gap-1">
                  <button onClick={() => vm.toggleActive(p)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors" title="Activar/Desactivar"><Power size={15} /></button>
                  <button onClick={() => vm.openEdit(p)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-error/5 text-neutral-400 hover:text-error cursor-pointer transition-colors"><Trash2 size={15} /></button>
                </div>
              )},
            ]}
          />
        )}
      </div>

      {/* Form Modal */}
      <ProductFormModal isOpen={vm.showForm} onClose={vm.closeForm} onSave={vm.save} editing={vm.editing} />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) vm.remove(deleteId); }}
        title="Eliminar producto"
        message="¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
      />
    </>
  );
}

function ProductFormModal({ isOpen, onClose, onSave, editing }: {
  isOpen: boolean; onClose: () => void;
  onSave: (data: { name: string; category: string; price: number; isActive: boolean }) => void;
  editing: Product | null;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const reset = () => { setName(editing?.name ?? ''); setCategory(editing?.category ?? ''); setPrice(editing?.price.toString() ?? ''); };

  // Reset form when modal opens
  if (isOpen && name === '' && !editing) reset();
  if (isOpen && editing && name !== editing.name) reset();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ name, category, price: parseFloat(price) || 0, isActive: editing?.isActive ?? true });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editing ? 'Editar Producto' : 'Nuevo Producto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <Input label="Categoría" value={category} onChange={e => setCategory(e.target.value)} required placeholder="Ej: Pan dulce, Café" />
        <Input label="Precio de venta" type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} required />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
        </div>
      </form>
    </Modal>
  );
}

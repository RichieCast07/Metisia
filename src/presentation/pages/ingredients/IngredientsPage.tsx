import { Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import Header from '@/presentation/components/layout/Header';
import Button from '@/presentation/components/ui/Button';
import SearchInput from '@/presentation/components/ui/SearchInput';
import DataTable from '@/presentation/components/ui/DataTable';
import Badge from '@/presentation/components/ui/Badge';
import Modal from '@/presentation/components/ui/Modal';
import Input from '@/presentation/components/ui/Input';
import Select from '@/presentation/components/ui/Select';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog';
import EmptyState from '@/presentation/components/ui/EmptyState';
import { useIngredientsViewModel } from '@/presentation/viewmodels/useIngredientsViewModel';
import { Ingredient, IngredientUnit } from '@/core/domain/entities/Ingredient';
import { useState, FormEvent } from 'react';

const unitOptions = Object.values(IngredientUnit).map(u => ({ value: u, label: u }));

export default function IngredientsPage() {
  const vm = useIngredientsViewModel();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      <Header title="Insumos" subtitle="Gestión de inventario" actions={<Button size="sm" onClick={vm.openCreate}><Plus size={16} /> Nuevo Insumo</Button>} />
      <div className="p-8 space-y-6">
        <SearchInput value={vm.search} onChange={vm.setSearch} placeholder="Buscar insumo..." />

        {vm.ingredients.length === 0 ? (
          <EmptyState title="Sin insumos" description="Agrega insumos para gestionar tu inventario" action={<Button size="sm" onClick={vm.openCreate}><Plus size={16} /> Crear insumo</Button>} />
        ) : (
          <DataTable
            data={vm.ingredients}
            keyExtractor={i => i.id}
            columns={[
              { key: 'name', header: 'Nombre', render: (i: Ingredient) => <span className="font-medium">{i.name}</span> },
              { key: 'stock', header: 'Stock', render: (i: Ingredient) => (
                <Badge variant={i.stock <= i.minStock ? 'warning' : 'success'}>{i.stock} {i.unit}</Badge>
              )},
              { key: 'minStock', header: 'Mín.', render: (i: Ingredient) => `${i.minStock} ${i.unit}` },
              { key: 'cost', header: 'Costo/u', render: (i: Ingredient) => `$${i.unitCost.toFixed(2)}` },
              { key: 'actions', header: '', render: (i: Ingredient) => (
                <div className="flex items-center gap-1">
                  <button onClick={() => vm.setShowAdjust(i)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" title="Ajustar stock"><ArrowUpDown size={15} /></button>
                  <button onClick={() => vm.openEdit(i)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteId(i.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"><Trash2 size={15} /></button>
                </div>
              )},
            ]}
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <IngredientFormModal isOpen={vm.showForm} onClose={vm.closeForm} onSave={vm.save} editing={vm.editing} />

      {/* Adjust Stock Modal */}
      <AdjustStockModal ingredient={vm.showAdjust} onClose={() => vm.setShowAdjust(null)} onAdjust={vm.doAdjust} />

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) vm.remove(deleteId); }} title="Eliminar insumo" message="¿Estás seguro de eliminar este insumo?" />
    </>
  );
}

function IngredientFormModal({ isOpen, onClose, onSave, editing }: {
  isOpen: boolean; onClose: () => void;
  onSave: (data: { name: string; unit: IngredientUnit; stock: number; minStock: number; unitCost: number }) => void;
  editing: Ingredient | null;
}) {
  const [name, setName] = useState(editing?.name ?? '');
  const [unit, setUnit] = useState<IngredientUnit>(editing?.unit ?? IngredientUnit.KG);
  const [stock, setStock] = useState(editing?.stock.toString() ?? '0');
  const [minStock, setMinStock] = useState(editing?.minStock.toString() ?? '0');
  const [unitCost, setUnitCost] = useState(editing?.unitCost.toString() ?? '0');

  if (isOpen && editing && name !== editing.name) {
    setName(editing.name); setUnit(editing.unit); setStock(editing.stock.toString());
    setMinStock(editing.minStock.toString()); setUnitCost(editing.unitCost.toString());
  }
  if (isOpen && !editing && name === '' && stock === '0') { /* defaults ok */ }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ name, unit, stock: parseFloat(stock) || 0, minStock: parseFloat(minStock) || 0, unitCost: parseFloat(unitCost) || 0 });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editing ? 'Editar Insumo' : 'Nuevo Insumo'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <Select label="Unidad" options={unitOptions} value={unit} onChange={e => setUnit(e.target.value as IngredientUnit)} />
        <div className="grid grid-cols-3 gap-4">
          <Input label="Stock" type="number" step="0.01" min="0" value={stock} onChange={e => setStock(e.target.value)} />
          <Input label="Stock mínimo" type="number" step="0.01" min="0" value={minStock} onChange={e => setMinStock(e.target.value)} />
          <Input label="Costo por unidad" type="number" step="0.01" min="0" value={unitCost} onChange={e => setUnitCost(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
        </div>
      </form>
    </Modal>
  );
}

function AdjustStockModal({ ingredient, onClose, onAdjust }: {
  ingredient: Ingredient | null; onClose: () => void;
  onAdjust: (id: string, qty: number, reason: string) => void;
}) {
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  if (!ingredient) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAdjust(ingredient.id, parseFloat(quantity) || 0, reason);
    setQuantity(''); setReason('');
  };

  return (
    <Modal isOpen onClose={onClose} title={`Ajustar stock: ${ingredient.name}`} size="sm">
      <p className="text-sm text-slate-500 mb-4">Stock actual: {ingredient.stock} {ingredient.unit}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Cantidad (positivo = entrada, negativo = salida)" type="number" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        <Input label="Motivo" value={reason} onChange={e => setReason(e.target.value)} required placeholder="Ej: Compra, Merma, Corrección" />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Ajustar</Button>
        </div>
      </form>
    </Modal>
  );
}

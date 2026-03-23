import { useState, useCallback, useMemo, FormEvent } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import { Plus, Trash2 } from 'lucide-react';
import Header from '@/presentation/components/layout/Header';
import Button from '@/presentation/components/ui/Button';
import DataTable from '@/presentation/components/ui/DataTable';
import Badge from '@/presentation/components/ui/Badge';
import Modal from '@/presentation/components/ui/Modal';
import Input from '@/presentation/components/ui/Input';
import Select from '@/presentation/components/ui/Select';
import SearchInput from '@/presentation/components/ui/SearchInput';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog';
import EmptyState from '@/presentation/components/ui/EmptyState';
import { Expense, ExpenseCategory } from '@/core/domain/entities/Expense';
import { createExpense, deleteExpense } from '@/core/domain/usecases/expenseUseCases';
import { LocalStorageExpenseRepository } from '@/infrastructure/repositories/LocalStorageExpenseRepository';
import { format } from 'date-fns';

const repo = new LocalStorageExpenseRepository();
const categoryOptions = Object.values(ExpenseCategory).map(c => ({ value: c, label: c }));

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

export default function ExpensesPage() {
  const user = useAuthStore(s => s.user);
  const businessId = user?.id ?? '';
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const expenses = useMemo(() => repo.getAll(businessId).reverse(), [businessId, refresh]);
  const filtered = useMemo(() => {
    if (!search.trim()) return expenses;
    const q = search.toLowerCase();
    return expenses.filter(e => e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
  }, [expenses, search]);

  const totalMonth = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const handleCreate = useCallback((data: { description: string; amount: number; category: ExpenseCategory; date: string }) => {
    createExpense(repo, { ...data, businessId, date: new Date(data.date) });
    setShowForm(false);
    setRefresh(r => r + 1);
  }, [businessId]);

  const handleDelete = useCallback((id: string) => {
    deleteExpense(repo, id);
    setRefresh(r => r + 1);
  }, []);

  return (
    <>
      <Header title="Gastos" subtitle={`Total acumulado: ${fmt(totalMonth)}`} actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Nuevo Gasto</Button>} />
      <div className="p-8 space-y-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar gastos..." />
        {filtered.length === 0 ? (
          <EmptyState title="Sin gastos" description="Registra tus gastos para llevar un control"  action={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Registrar gasto</Button>} />
        ) : (
          <DataTable
            data={filtered}
            keyExtractor={e => e.id}
            columns={[
              { key: 'date', header: 'Fecha', render: (e: Expense) => format(new Date(e.date), 'dd/MM/yyyy') },
              { key: 'description', header: 'Descripción', render: (e: Expense) => <span className="font-medium">{e.description}</span> },
              { key: 'category', header: 'Categoría', render: (e: Expense) => <Badge>{e.category}</Badge> },
              { key: 'amount', header: 'Monto', render: (e: Expense) => <span className="font-semibold text-red-500">{fmt(e.amount)}</span> },
              { key: 'actions', header: '', render: (e: Expense) => (
                <button onClick={() => setDeleteId(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"><Trash2 size={15} /></button>
              )},
            ]}
          />
        )}
      </div>
      <ExpenseFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleCreate} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) handleDelete(deleteId); }} title="Eliminar gasto" message="¿Eliminar este gasto?" />
    </>
  );
}

function ExpenseFormModal({ isOpen, onClose, onSave }: {
  isOpen: boolean; onClose: () => void;
  onSave: (data: { description: string; amount: number; category: ExpenseCategory; date: string }) => void;
}) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.INSUMOS);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ description: desc, amount: parseFloat(amount) || 0, category, date });
    setDesc(''); setAmount('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Gasto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Descripción" value={desc} onChange={e => setDesc(e.target.value)} required placeholder="Ej: Compra de harina" />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Monto" type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} required />
          <Input label="Fecha" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <Select label="Categoría" options={categoryOptions} value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Registrar</Button>
        </div>
      </form>
    </Modal>
  );
}

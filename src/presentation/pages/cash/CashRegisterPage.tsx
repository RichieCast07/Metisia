import { useState, useCallback, useMemo, FormEvent } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import Header from '@/presentation/components/layout/Header';
import Button from '@/presentation/components/ui/Button';
import Card from '@/presentation/components/ui/Card';
import Badge from '@/presentation/components/ui/Badge';
import Input from '@/presentation/components/ui/Input';
import Alert from '@/presentation/components/ui/Alert';
import DataTable from '@/presentation/components/ui/DataTable';
import { Landmark, LockOpen, Lock } from 'lucide-react';
import { openCashRegister, closeCashRegister, getCurrentCashRegister } from '@/core/domain/usecases/cashRegisterUseCases';
import { LocalStorageCashRegisterRepository, LocalStorageCashRegisterHistoryRepository } from '@/infrastructure/repositories/LocalStorageCashRegisterRepository';
import { LocalStorageSaleRepository } from '@/infrastructure/repositories/LocalStorageSaleRepository';
import { LocalStorageExpenseRepository } from '@/infrastructure/repositories/LocalStorageExpenseRepository';
import { CashRegisterHistory } from '@/core/domain/entities/CashRegister';
import { format } from 'date-fns';

const cashRepo = new LocalStorageCashRegisterRepository();
const historyRepo = new LocalStorageCashRegisterHistoryRepository();
const saleRepo = new LocalStorageSaleRepository();
const expenseRepo = new LocalStorageExpenseRepository();

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

export default function CashRegisterPage() {
  const user = useAuthStore(s => s.user);
  const businessId = user?.id ?? '';
  const [refresh, setRefresh] = useState(0);
  const [openAmount, setOpenAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const current = useMemo(() => getCurrentCashRegister(cashRepo, businessId), [businessId, refresh]);
  const history = useMemo(() => historyRepo.getAll(businessId).reverse(), [businessId, refresh]);

  const handleOpen = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      openCashRegister(cashRepo, businessId, parseFloat(openAmount) || 0, user?.name ?? '');
      setOpenAmount('');
      setSuccess('Caja abierta correctamente');
      setRefresh(r => r + 1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleClose = useCallback(() => {
    setError(null);
    try {
      closeCashRegister(cashRepo, historyRepo, saleRepo, expenseRepo, businessId, 0);
      setSuccess('Caja cerrada correctamente');
      setRefresh(r => r + 1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  }, [businessId]);

  return (
    <>
      <Header title="Caja Registradora" subtitle="Control de apertura y cierre" />
      <div className="p-8 space-y-8">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} />}

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Landmark size={18} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-neutral-900">Estado Actual</h2>
          </div>
          {current ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="success">Abierta</Badge>
                <span className="text-sm text-neutral-500">
                  Apertura: {format(new Date(current.openedAt), 'dd/MM/yyyy HH:mm')} — Monto inicial: {fmt(current.openingAmount)}
                </span>
              </div>
              <Button variant="danger" onClick={handleClose}><Lock size={16} /> Cerrar Caja</Button>
            </div>
          ) : (
            <form onSubmit={handleOpen} className="space-y-4">
              <p className="text-sm text-neutral-500">La caja está cerrada. Ábrela para empezar a registrar ventas.</p>
              <Input label="Monto de apertura" type="number" step="0.01" min="0" value={openAmount} onChange={e => setOpenAmount(e.target.value)} required placeholder="0.00" />
              <Button type="submit"><LockOpen size={16} /> Abrir Caja</Button>
            </form>
          )}
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Historial de Cortes</h2>
          {history.length === 0 ? (
            <p className="text-sm text-neutral-500">Sin cortes registrados</p>
          ) : (
            <DataTable
              data={history}
              keyExtractor={h => h.id}
              columns={[
                { key: 'date', header: 'Fecha', render: (h: CashRegisterHistory) => format(new Date(h.closedAt), 'dd/MM/yyyy HH:mm') },
                { key: 'opening', header: 'Apertura', render: (h: CashRegisterHistory) => fmt(h.openingAmount) },
                { key: 'sales', header: 'Ventas', render: (h: CashRegisterHistory) => fmt(h.totalSales) },
                { key: 'closing', header: 'Cierre', render: (h: CashRegisterHistory) => fmt(h.closingAmount) },
              ]}
            />
          )}
        </Card>
      </div>
    </>
  );
}

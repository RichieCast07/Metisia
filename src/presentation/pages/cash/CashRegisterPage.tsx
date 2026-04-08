import { useState, useEffect, FormEvent } from 'react';
import Header from '@/presentation/components/layout/Header';
import Button from '@/presentation/components/ui/Button';
import Card from '@/presentation/components/ui/Card';
import Badge from '@/presentation/components/ui/Badge';
import Input from '@/presentation/components/ui/Input';
import Alert from '@/presentation/components/ui/Alert';
import { Landmark, LockOpen, Lock } from 'lucide-react';
import { cashRegisterApi, ApiCashRegister } from '@/infrastructure/api/cashRegisterApi';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import { format } from 'date-fns';

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

async function fetchCurrent(): Promise<ApiCashRegister | null> {
  try {
    return await cashRegisterApi.getCurrent();
  } catch {
    return null;
  }
}

export default function CashRegisterPage() {
  const user = useAuthStore(s => s.user);
  const [current, setCurrent] = useState<ApiCashRegister | null>(null);
  const [openAmount, setOpenAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrent().then(setCurrent);
  }, []);

  const handleOpen = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await cashRegisterApi.open({
        opening_amount: parseFloat(openAmount) || 0,
        opened_at: new Date().toISOString(),
        opened_by: user?.name ?? 'Usuario',
        status: 'open',
      });
      setOpenAmount('');
      setSuccess('Caja abierta correctamente');
      setCurrent(await fetchCurrent());
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al abrir la caja');
    }
  };

  const handleClose = async () => {
    if (!current) return;
    setError(null);
    try {
      await cashRegisterApi.close(current.id, {
        closing_amount: current.opening_amount,
        closed_at: new Date().toISOString(),
      });
      setSuccess('Caja cerrada correctamente');
      setCurrent(await fetchCurrent());
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar la caja');
    }
  };

  return (
    <>
      <Header title="Caja Registradora" subtitle="Control de apertura y cierre" />
      <div className="p-8 space-y-8">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} />}

        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-primary-light rounded-xl ring-1 ring-primary/20">
              <Landmark size={18} className="text-primary" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Estado Actual</h2>
          </div>
          {current ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="success">Abierta</Badge>
                <span className="text-sm text-slate-500">
                  Apertura: {format(new Date(current.opened_at), 'dd/MM/yyyy HH:mm')} — Monto inicial: {fmt(current.opening_amount)}
                </span>
              </div>
              <Button variant="danger" onClick={handleClose}><Lock size={16} /> Cerrar Caja</Button>
            </div>
          ) : (
            <form onSubmit={handleOpen} className="space-y-4">
              <p className="text-sm text-slate-500">La caja está cerrada. Ábrela para empezar a registrar ventas.</p>
              <Input label="Monto de apertura" type="number" step="0.01" min="0" value={openAmount} onChange={e => setOpenAmount(e.target.value)} required placeholder="0.00" />
              <Button type="submit"><LockOpen size={16} /> Abrir Caja</Button>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}

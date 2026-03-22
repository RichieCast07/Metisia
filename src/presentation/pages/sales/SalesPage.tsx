import { useMemo, useState } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import Header from '@/presentation/components/layout/Header';
import DataTable from '@/presentation/components/ui/DataTable';
import Badge from '@/presentation/components/ui/Badge';
import SearchInput from '@/presentation/components/ui/SearchInput';
import EmptyState from '@/presentation/components/ui/EmptyState';
import { LocalStorageSaleRepository } from '@/infrastructure/repositories/LocalStorageSaleRepository';
import { Sale } from '@/core/domain/entities/Sale';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const repo = new LocalStorageSaleRepository();

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

export default function SalesPage() {
  const user = useAuthStore(s => s.user);
  const businessId = user?.id ?? '';
  const [search, setSearch] = useState('');

  const sales = useMemo(() => repo.getAll(businessId).reverse(), [businessId]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sales;
    const q = search.toLowerCase();
    return sales.filter(s => s.items.some(i => i.productName.toLowerCase().includes(q)) || s.paymentMethod.includes(q));
  }, [sales, search]);

  return (
    <>
      <Header title="Ventas" subtitle="Historial de transacciones" />
      <div className="p-8 space-y-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por producto o método de pago..." />
        {filtered.length === 0 ? (
          <EmptyState title="Sin ventas" description="Las ventas se registran desde el Punto de Venta" />
        ) : (
          <DataTable
            data={filtered}
            keyExtractor={s => s.id}
            columns={[
              { key: 'date', header: 'Fecha', render: (s: Sale) => format(new Date(s.createdAt), "dd/MM/yyyy HH:mm", { locale: es }) },
              { key: 'items', header: 'Productos', render: (s: Sale) => (
                <div className="max-w-xs truncate">{s.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}</div>
              )},
              { key: 'subtotal', header: 'Subtotal', render: (s: Sale) => fmt(s.subtotal) },
              { key: 'discount', header: 'Descuento', render: (s: Sale) => s.discount > 0 ? <span className="text-error">-{fmt(s.discount)}</span> : '-' },
              { key: 'total', header: 'Total', render: (s: Sale) => <span className="font-semibold">{fmt(s.total)}</span> },
              { key: 'payment', header: 'Pago', render: (s: Sale) => <Badge variant="info">{s.paymentMethod}</Badge> },
            ]}
          />
        )}
      </div>
    </>
  );
}

import { useEffect, useState, useMemo } from 'react';
import Header from '@/presentation/components/layout/Header';
import DataTable from '@/presentation/components/ui/DataTable';
import Badge from '@/presentation/components/ui/Badge';
import SearchInput from '@/presentation/components/ui/SearchInput';
import EmptyState from '@/presentation/components/ui/EmptyState';
import { saleApi, ApiSale } from '@/infrastructure/api/saleApi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

export default function SalesPage() {
  const [sales, setSales] = useState<ApiSale[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    saleApi.list().then(data => setSales(data.slice().reverse())).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return sales;
    const q = search.toLowerCase();
    return sales.filter(s =>
      s.items.some(i => i.product_name.toLowerCase().includes(q)) ||
      s.payment_method.toLowerCase().includes(q)
    );
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
              { key: 'date', header: 'Fecha', render: (s: ApiSale) => format(new Date(s.created_at), 'dd/MM/yyyy HH:mm', { locale: es }) },
              { key: 'items', header: 'Productos', render: (s: ApiSale) => (
                <div className="max-w-xs truncate">{s.items.map(i => `${i.product_name} x${i.quantity}`).join(', ')}</div>
              )},
              { key: 'subtotal', header: 'Subtotal', render: (s: ApiSale) => fmt(s.subtotal) },
              { key: 'discount', header: 'Descuento', render: (s: ApiSale) => s.discount > 0 ? <span className="text-red-500">-{fmt(s.discount)}</span> : '-' },
              { key: 'total', header: 'Total', render: (s: ApiSale) => <span className="font-semibold">{fmt(s.total)}</span> },
              { key: 'payment', header: 'Pago', render: (s: ApiSale) => <Badge variant="info">{s.payment_method}</Badge> },
            ]}
          />
        )}
      </div>
    </>
  );
}

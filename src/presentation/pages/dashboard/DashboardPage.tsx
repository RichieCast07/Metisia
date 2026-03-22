import {
  DollarSign, ShoppingCart, TrendingUp, Package, AlertTriangle, CreditCard,
} from 'lucide-react';
import Header from '@/presentation/components/layout/Header';
import StatCard from '@/presentation/components/ui/StatCard';
import Card from '@/presentation/components/ui/Card';
import Badge from '@/presentation/components/ui/Badge';
import { useDashboardViewModel } from '@/presentation/viewmodels/useDashboardViewModel';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DashboardPage() {
  const vm = useDashboardViewModel();

  return (
    <>
      <Header title="Dashboard" subtitle={`Bienvenido de nuevo — ${vm.businessName}`} />
      <div className="p-8 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Ventas Hoy"
            value={fmt(vm.todaySalesTotal)}
            icon={DollarSign}
            color="success"
            trend={vm.salesTrend !== 0 ? { value: vm.salesTrend, label: 'vs ayer' } : undefined}
          />
          <StatCard title="Transacciones Hoy" value={vm.todaySalesCount} icon={ShoppingCart} color="secondary" />
          <StatCard title="Ganancia del Mes" value={fmt(vm.monthProfit)} icon={TrendingUp} color={vm.monthProfit >= 0 ? 'success' : 'error'} />
          <StatCard title="Productos" value={vm.productCount} icon={Package} color="primary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent sales */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-neutral-900">Ventas Recientes</h3>
              <span className="text-xs text-neutral-400">Hoy</span>
            </div>
            {vm.recentSales.length === 0 ? (
              <p className="text-sm text-neutral-400 py-4">Sin ventas hoy</p>
            ) : (
              <div className="space-y-1">
                {vm.recentSales.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-neutral-700">{s.items.length} artículo{s.items.length > 1 ? 's' : ''}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{format(new Date(s.createdAt), 'HH:mm', { locale: es })}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <Badge variant="info">{s.paymentMethod}</Badge>
                      <p className="text-sm font-bold text-neutral-900">{fmt(s.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Sidebar cards */}
          <div className="space-y-5">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard size={16} className="text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Estado de Caja</h3>
              </div>
              <Badge variant={vm.isCashOpen ? 'success' : 'error'}>
                {vm.isCashOpen ? 'Abierta' : 'Cerrada'}
              </Badge>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <AlertTriangle size={16} className="text-warning" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Stock Bajo</h3>
              </div>
              {vm.lowStockCount === 0 ? (
                <p className="text-sm text-neutral-400">Todo en orden</p>
              ) : (
                <div className="space-y-2.5">
                  {vm.lowStockIngredients.slice(0, 5).map(i => (
                    <div key={i.id} className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600">{i.name}</span>
                      <Badge variant="warning">{i.stock} {i.unit}</Badge>
                    </div>
                  ))}
                  {vm.lowStockCount > 5 && (
                    <p className="text-xs text-neutral-400 pt-1">+{vm.lowStockCount - 5} más</p>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

import {
  DollarSign, ShoppingCart, TrendingUp, Package, AlertTriangle, CreditCard,
  Banknote, Building2, Wallet, Sun, Moon, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import Badge from '@/presentation/components/ui/Badge';
import { useDashboardViewModel } from '@/presentation/viewmodels/useDashboardViewModel';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Buenos días', Icon: Sun };
  if (h < 19) return { text: 'Buenas tardes', Icon: Sun };
  return { text: 'Buenas noches', Icon: Moon };
}

function PaymentIcon({ method }: { method: string }) {
  const m = method.toLowerCase();
  if (m.includes('efectivo') || m.includes('cash')) return <Banknote size={15} />;
  if (m.includes('tarjeta') || m.includes('card')) return <CreditCard size={15} />;
  if (m.includes('transfer')) return <Building2 size={15} />;
  return <Wallet size={15} />;
}

const sparkBars = [35, 55, 45, 70, 48, 85, 62];

export default function DashboardPage() {
  const vm = useDashboardViewModel();
  const { text: greeting, Icon: GreetingIcon } = getGreeting();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-8 pt-8 pb-20">
        <div className="flex items-center gap-2 mb-2">
          <GreetingIcon size={18} className="text-blue-200" />
          <span className="text-blue-200 text-sm font-medium">{greeting}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{vm.businessName}</h1>
        <p className="text-blue-300 text-sm mt-1 font-medium capitalize">
          {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
        </p>
      </div>

      <div className="px-8 -mt-12 pb-12 space-y-8">

        {/* ── Stat cards — overlap the gradient ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Ventas hoy */}
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl border border-emerald-100 shadow-lg p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-emerald-100">
                <DollarSign size={20} className="text-emerald-700" />
              </div>
              {vm.salesTrend !== 0 && (
                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${vm.salesTrend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {vm.salesTrend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(vm.salesTrend)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{fmt(vm.todaySalesTotal)}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Ventas Hoy</p>
          </div>

          {/* Transacciones */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-lg p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-slate-100">
                <ShoppingCart size={20} className="text-slate-700" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{vm.todaySalesCount}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Transacciones Hoy</p>
          </div>

          {/* Ganancia del Mes + sparkline */}
          <div className={`bg-gradient-to-br rounded-2xl border shadow-lg p-5 ${vm.monthProfit >= 0 ? 'from-white to-emerald-50 border-emerald-100' : 'from-white to-red-50 border-red-100'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${vm.monthProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                <TrendingUp size={20} className={vm.monthProfit >= 0 ? 'text-emerald-700' : 'text-red-700'} />
              </div>
            </div>
            <p className={`text-2xl font-extrabold tracking-tight ${vm.monthProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {fmt(vm.monthProfit)}
            </p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Ganancia del Mes</p>
            {/* Mini sparkline */}
            <div className="flex items-end gap-1 mt-3 h-8">
              {sparkBars.map((barH, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${vm.monthProfit >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`}
                  style={{ height: `${barH}%`, opacity: 0.25 + (i / (sparkBars.length - 1)) * 0.75 }}
                />
              ))}
            </div>
          </div>

          {/* Productos */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 shadow-lg p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-blue-100">
                <Package size={20} className="text-blue-700" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-blue-700 tracking-tight">{vm.productCount}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Productos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Ventas Recientes ── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Ventas Recientes</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Actividad del día</p>
              </div>
              <Badge variant="info">Hoy</Badge>
            </div>

            {vm.recentSales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <ShoppingCart size={36} strokeWidth={1.2} className="text-slate-200 mb-3" />
                <p className="text-sm text-slate-400 font-medium">Sin ventas registradas hoy</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {vm.recentSales.map((s, idx) => (
                  <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <PaymentIcon method={s.paymentMethod} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        {s.items.length} artículo{s.items.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {format(new Date(s.createdAt), 'HH:mm', { locale: es })}
                        {' · '}
                        <span className="font-semibold text-slate-500">{s.paymentMethod}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-900">{fmt(s.total)}</p>
                      <p className="text-[11px] text-slate-300 mt-0.5 font-mono">#{String(idx + 1).padStart(3, '0')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5">

            {/* Estado de Caja */}
            <div className={`bg-white rounded-2xl shadow-md overflow-hidden border-2 ${vm.isCashOpen ? 'border-emerald-200' : 'border-red-200'}`}>
              <div className={`px-6 py-4 border-b ${vm.isCashOpen ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${vm.isCashOpen ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    <CreditCard size={17} className={vm.isCashOpen ? 'text-emerald-700' : 'text-red-700'} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Estado de Caja</h3>
                    <p className={`text-xs font-semibold mt-0.5 ${vm.isCashOpen ? 'text-emerald-600' : 'text-red-600'}`}>
                      {vm.isCashOpen ? 'Sesión en curso' : 'Caja no iniciada'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${vm.isCashOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
                  <Badge variant={vm.isCashOpen ? 'success' : 'error'}>
                    {vm.isCashOpen ? 'Caja Abierta' : 'Caja Cerrada'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stock Bajo */}
            <div className={`bg-white rounded-2xl shadow-md overflow-hidden border-2 ${vm.lowStockCount === 0 ? 'border-slate-200' : 'border-amber-300'}`}>
              <div className={`px-6 py-4 border-b ${vm.lowStockCount === 0 ? 'bg-slate-50 border-slate-100' : 'bg-amber-50 border-amber-100'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${vm.lowStockCount === 0 ? 'bg-slate-100' : 'bg-amber-100'}`}>
                      <AlertTriangle size={17} className={vm.lowStockCount === 0 ? 'text-slate-500' : 'text-amber-700'} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">Stock Bajo</h3>
                      <p className={`text-xs font-semibold mt-0.5 ${vm.lowStockCount === 0 ? 'text-slate-400' : 'text-amber-700'}`}>
                        {vm.lowStockCount === 0 ? 'Inventario OK' : `${vm.lowStockCount} alerta${vm.lowStockCount > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>
                  {vm.lowStockCount > 0 && (
                    <span className="text-xl font-extrabold text-amber-600">{vm.lowStockCount}</span>
                  )}
                </div>
              </div>
              <div className="px-6 py-5">
                {vm.lowStockCount === 0 ? (
                  <p className="text-sm text-slate-400 font-medium">Sin alertas de inventario</p>
                ) : (
                  <div className="space-y-3">
                    {vm.lowStockIngredients.slice(0, 5).map(i => (
                      <div key={i.id} className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-700 truncate flex-1">{i.name}</span>
                        <Badge variant="warning">{i.stock} {i.unit}</Badge>
                      </div>
                    ))}
                    {vm.lowStockCount > 5 && (
                      <p className="text-xs text-slate-400 font-medium pt-1">+{vm.lowStockCount - 5} más ingredientes</p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import Header from '@/presentation/components/layout/Header';
import Card from '@/presentation/components/ui/Card';
import StatCard from '@/presentation/components/ui/StatCard';
import Input from '@/presentation/components/ui/Input';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { getProfitReport, getSalesGrowth } from '@/core/domain/usecases/reportUseCases';
import { LocalStorageSaleRepository } from '@/infrastructure/repositories/LocalStorageSaleRepository';
import { LocalStorageExpenseRepository } from '@/infrastructure/repositories/LocalStorageExpenseRepository';
import { startOfMonth, endOfMonth, format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const saleRepo = new LocalStorageSaleRepository();
const expenseRepo = new LocalStorageExpenseRepository();

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

export default function ReportsPage() {
  const user = useAuthStore(s => s.user);
  const businessId = user?.id ?? '';
  const now = new Date();
  const [month, setMonth] = useState(format(now, 'yyyy-MM'));

  const dateRange = useMemo(() => {
    const d = parseISO(`${month}-01`);
    return { from: startOfMonth(d), to: endOfMonth(d) };
  }, [month]);

  const profitReport = useMemo(
    () => getProfitReport(saleRepo, expenseRepo, businessId, dateRange.from, dateRange.to),
    [businessId, dateRange]
  );

  const growth = useMemo(
    () => getSalesGrowth(saleRepo, businessId),
    [businessId]
  );

  return (
    <>
      <Header title="Reportes" subtitle="Análisis financiero de tu negocio" actions={
        <Input type="month" value={month} onChange={e => setMonth(e.target.value)} />
      } />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Ventas del Mes" value={fmt(profitReport.totalSales)} icon={DollarSign} color="success" />
          <StatCard title="Gastos del Mes" value={fmt(profitReport.totalExpenses)} icon={TrendingDown} color="error" />
          <StatCard title="Ganancia Neta" value={fmt(profitReport.netProfit)} icon={TrendingUp} color={profitReport.netProfit >= 0 ? 'success' : 'error'} />
          <StatCard title="Margen" value={`${profitReport.marginPercentage.toFixed(1)}%`} icon={ShoppingCart} color="secondary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-5">Ingresos vs Gastos</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[{ name: 'Período', ventas: profitReport.totalSales, gastos: profitReport.totalExpenses }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => fmt(Number(v ?? 0))} />
                <Bar dataKey="ventas" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-5">Crecimiento de Ventas</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-5 rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-1">Hoy</p>
                <p className="text-xl font-bold text-slate-900">{fmt(growth.today)}</p>
                <p className={`text-xs mt-1 ${growth.growthPercentage.daily >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {growth.growthPercentage.daily >= 0 ? '+' : ''}{growth.growthPercentage.daily.toFixed(1)}% vs ayer
                </p>
              </div>
              <div className="text-center p-5 rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-1">Semana</p>
                <p className="text-xl font-bold text-slate-900">{fmt(growth.lastWeek)}</p>
                <p className={`text-xs mt-1 ${growth.growthPercentage.weekly >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {growth.growthPercentage.weekly >= 0 ? '+' : ''}{growth.growthPercentage.weekly.toFixed(1)}% vs anterior
                </p>
              </div>
              <div className="text-center p-5 rounded-2xl bg-slate-100 ring-1 ring-slate-200 col-span-2">
                <p className="text-xs font-medium text-slate-500 mb-1">Mes</p>
                <p className="text-xl font-bold text-slate-900">{fmt(growth.lastMonth)}</p>
                <p className={`text-xs mt-1 ${growth.growthPercentage.monthly >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {growth.growthPercentage.monthly >= 0 ? '+' : ''}{growth.growthPercentage.monthly.toFixed(1)}% vs anterior
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

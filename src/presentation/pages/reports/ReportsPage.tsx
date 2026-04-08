import { useMemo, useState, useEffect } from 'react';
import Header from '@/presentation/components/layout/Header';
import Card from '@/presentation/components/ui/Card';
import StatCard from '@/presentation/components/ui/StatCard';
import Input from '@/presentation/components/ui/Input';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { reportApi, PaymentMethodsResponse, TopProductsResponse } from '@/infrastructure/api/reportApi';
import { expenseApi, ApiExpense } from '@/infrastructure/api/expenseApi';
import { startOfMonth, endOfMonth, format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

export default function ReportsPage() {
  const now = new Date();
  const [month, setMonth] = useState(format(now, 'yyyy-MM'));
  const [paymentData, setPaymentData] = useState<PaymentMethodsResponse | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductsResponse | null>(null);
  const [expenses, setExpenses] = useState<ApiExpense[]>([]);

  const dateRange = useMemo(() => {
    const d = parseISO(`${month}-01`);
    return {
      from: format(startOfMonth(d), 'yyyy-MM-dd'),
      to: format(endOfMonth(d), 'yyyy-MM-dd'),
    };
  }, [month]);

  useEffect(() => {
    Promise.all([
      reportApi.paymentMethods(dateRange.from, dateRange.to),
      reportApi.topProducts(dateRange.from, dateRange.to, 5),
      expenseApi.list(),
    ]).then(([pm, tp, exp]) => {
      setPaymentData(pm);
      setTopProducts(tp);
      setExpenses(exp);
    }).catch(() => {});
  }, [dateRange]);

  const totalSales = useMemo(
    () => paymentData ? Object.values(paymentData.data).reduce((a, b) => a + b, 0) : 0,
    [paymentData]
  );

  const totalExpenses = useMemo(
    () => expenses.filter(e => e.date >= dateRange.from && e.date <= dateRange.to).reduce((sum, e) => sum + e.amount, 0),
    [expenses, dateRange]
  );

  const netProfit = totalSales - totalExpenses;
  const marginPct = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  const chartData = useMemo(
    () => [{ name: 'Período', ventas: totalSales, gastos: totalExpenses }],
    [totalSales, totalExpenses]
  );

  const paymentChartData = useMemo(
    () => paymentData ? Object.entries(paymentData.data).map(([name, value]) => ({ name, value })) : [],
    [paymentData]
  );

  return (
    <>
      <Header title="Reportes" subtitle="Análisis financiero de tu negocio" actions={
        <Input type="month" value={month} onChange={e => setMonth(e.target.value)} />
      } />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Ventas del Mes" value={fmt(totalSales)} icon={DollarSign} color="success" />
          <StatCard title="Gastos del Mes" value={fmt(totalExpenses)} icon={TrendingDown} color="error" />
          <StatCard title="Ganancia Neta" value={fmt(netProfit)} icon={TrendingUp} color={netProfit >= 0 ? 'success' : 'error'} />
          <StatCard title="Margen" value={`${marginPct.toFixed(1)}%`} icon={ShoppingCart} color="secondary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-5">Ingresos vs Gastos</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => fmt(Number(v ?? 0))} />
                <Bar dataKey="ventas" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" fill="var(--color-error)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-5">Métodos de Pago</h3>
            {paymentChartData.length === 0 ? (
              <p className="text-sm text-slate-500">Sin datos para el período seleccionado.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={paymentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v) => fmt(Number(v ?? 0))} />
                  <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {topProducts && topProducts.products.length > 0 && (
            <Card className="lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-5">Productos Más Vendidos</h3>
              <div className="space-y-2">
                {topProducts.products.map(([name, qty]) => (
                  <div key={name} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-medium text-slate-900">{name}</span>
                    <span className="text-sm text-slate-500">{qty} uds</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

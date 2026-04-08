import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { reportApi, DailyReportResponse } from '@/infrastructure/api/reportApi';
import { ingredientApi, ApiIngredient } from '@/infrastructure/api/ingredientApi';
import StatCard from '@/presentation/components/ui/StatCard';
import Card from '@/presentation/components/ui/Card';
import Header from '@/presentation/components/layout/Header';
import { format } from 'date-fns';

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

export default function DashboardPage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [report, setReport] = useState<DailyReportResponse | null>(null);
  const [lowStock, setLowStock] = useState<ApiIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportApi.daily(today),
      ingredientApi.list(),
    ]).then(([rep, ingredients]) => {
      setReport(rep);
      setLowStock(ingredients.filter(i => i.stock <= i.min_stock));
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, [today]);

  return (
    <>
      <Header title="Dashboard" subtitle="Resumen del negocio" />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Ventas Hoy" value={isLoading ? '...' : fmt(report?.total_ventas ?? 0)} icon={DollarSign} color="success" />
          <StatCard title="Gastos Hoy" value={isLoading ? '...' : fmt(report?.total_gastos ?? 0)} icon={TrendingDown} color="error" />
          <StatCard title="Ganancia" value={isLoading ? '...' : fmt(report?.ganancia ?? 0)} icon={TrendingUp} color="primary" />
          <StatCard title="Inventario Bajo" value={isLoading ? '...' : String(lowStock.length)} icon={AlertTriangle} color="warning" />
        </div>

        <Card title="Ingredientes con stock bajo">
          {lowStock.length === 0 ? (
            <p className="text-sm text-slate-500">Todo el inventario está en niveles normales.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 font-medium text-slate-500">Ingrediente</th>
                  <th className="text-left py-2 font-medium text-slate-500">Stock</th>
                  <th className="text-left py-2 font-medium text-slate-500">Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map(i => (
                  <tr key={i.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 font-medium text-slate-900">{i.name}</td>
                    <td className="py-2 text-red-500 font-semibold">{i.stock} {i.unit}</td>
                    <td className="py-2 text-slate-500">{i.min_stock} {i.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}

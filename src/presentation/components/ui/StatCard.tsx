import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'error';
  children?: ReactNode;
}

const colorMap: Record<string, { bg: string; icon: string; ring: string }> = {
  primary: { bg: 'bg-blue-100', icon: 'text-blue-700', ring: 'ring-blue-200' },
  secondary: { bg: 'bg-slate-100', icon: 'text-slate-700', ring: 'ring-slate-200' },
  accent: { bg: 'bg-amber-100', icon: 'text-amber-700', ring: 'ring-amber-200' },
  success: { bg: 'bg-emerald-100', icon: 'text-emerald-700', ring: 'ring-emerald-200' },
  error: { bg: 'bg-red-100', icon: 'text-red-700', ring: 'ring-red-200' },
};

export default function StatCard({ title, value, icon: Icon, trend, color = 'primary' }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 transition-all duration-200 hover:shadow-elevated group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-slate-500 font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight leading-none">{value}</p>
          {trend && (
            <div className="flex items-center gap-2 mt-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${trend.value >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-400 font-medium">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl ${c.bg} ${c.ring} ring-1`}>
          <Icon size={24} strokeWidth={2} className={c.icon} />
        </div>
      </div>
    </div>
  );
}

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

type StatCardColor = 'primary' | 'success' | 'error' | 'warning' | 'secondary';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: StatCardColor;
  trend?: string;
}

const colorMap: Record<StatCardColor, { bg: string; icon: string }> = {
  primary: { bg: 'bg-primary-light', icon: 'text-primary' },
  success: { bg: 'bg-green-100', icon: 'text-success' },
  error: { bg: 'bg-red-100', icon: 'text-error' },
  warning: { bg: 'bg-amber-100', icon: 'text-warning' },
  secondary: { bg: 'bg-indigo-100', icon: 'text-secondary' },
};

export default function StatCard({ title, value, icon: Icon, color = 'primary', trend }: StatCardProps) {
  const { bg, icon: iconColor } = colorMap[color];
  const isPositive = trend ? trend.startsWith('+') : null;

  return (
    <div className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className={`p-2.5 rounded-xl ${bg} shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5 truncate">{value}</p>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium mt-1 ${isPositive ? 'text-success' : 'text-error'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

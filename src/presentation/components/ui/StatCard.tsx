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

const colorMap: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  error: 'bg-error/10 text-error',
};

export default function StatCard({ title, value, icon: Icon, trend, color = 'primary' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-card p-5 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1.5">{value}</p>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${trend.value >= 0 ? 'text-success' : 'text-error'}`}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

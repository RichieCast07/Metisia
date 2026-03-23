interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const variantMap: Record<string, string> = {
  default: 'bg-slate-100 text-slate-700 ring-slate-300',
  success: 'bg-emerald-100 text-emerald-800 ring-emerald-300',
  warning: 'bg-amber-100 text-amber-800 ring-amber-300',
  error: 'bg-red-100 text-red-800 ring-red-300',
  info: 'bg-blue-100 text-blue-800 ring-blue-300',
};

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ring-1 ${variantMap[variant]}`}>
      {children}
    </span>
  );
}

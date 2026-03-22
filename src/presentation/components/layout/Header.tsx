import { Bell } from 'lucide-react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="h-[64px] bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-neutral-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button className="relative p-2 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-neutral-100">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-neutral-600 hidden md:block">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}

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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          {actions}
          <button className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
            <Bell size={18} />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden md:block">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

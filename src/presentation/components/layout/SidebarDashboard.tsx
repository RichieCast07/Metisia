import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  TrendingDown,
  Tag,
  BarChart2,
  Users,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Punto de Venta', icon: ShoppingCart, to: '/pos' },
  { label: 'Productos', icon: Package, to: '/products' },
  { label: 'Ingredientes', icon: Layers, to: '/ingredients' },
  { label: 'Ventas', icon: CreditCard, to: '/sales' },
  { label: 'Gastos', icon: TrendingDown, to: '/expenses' },
  { label: 'Promociones', icon: Tag, to: '/promotions' },
  { label: 'Trabajadores', icon: Users, to: '/workers' },
  { label: 'Reportes', icon: BarChart2, to: '/reports' },
  { label: 'Ajustes', icon: Settings, to: '/settings' },
];

export default function SidebarDashboard() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="flex flex-col h-screen w-60 bg-white border-r border-slate-200 shrink-0">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <ShoppingCart size={16} className="text-white" />
        </div>
        <span className="font-bold text-slate-900 text-base tracking-tight truncate">
          Bagguets POS
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          <span>Cerrar sesion</span>
        </button>
      </div>
    </aside>
  );
}

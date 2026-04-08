import { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';

const COLLAPSED_KEY = 'sidebar-collapsed';

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

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(COLLAPSED_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <aside
      className={`relative flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}
    >
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-200 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <ShoppingCart size={16} className="text-white" />
        </div>
          <span className="font-bold text-slate-900 text-base tracking-tight truncate">
            Bagguets POS
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Icon size={18} className="shrink-0" />
          </NavLink>
        ))}
      </nav>

      <div className={`border-t border-slate-200 p-3 ${collapsed ? 'flex flex-col items-center gap-3' : ''}`}>
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title="Cerrar sesion"
          className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} className="shrink-0" />
        </button>
      </div>

      <button
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 shadow-sm transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}

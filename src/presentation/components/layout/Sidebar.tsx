import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, Wheat, Receipt,
  Tag, Landmark, CreditCard, Users, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut, Store,
} from 'lucide-react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pos', label: 'Punto de Venta', icon: ShoppingCart },
  { to: '/products', label: 'Productos', icon: Package },
  { to: '/ingredients', label: 'Insumos', icon: Wheat },
  { to: '/sales', label: 'Ventas', icon: Receipt },
  { to: '/promotions', label: 'Promociones', icon: Tag },
  { to: '/cash-register', label: 'Caja', icon: Landmark },
  { to: '/expenses', label: 'Gastos', icon: CreditCard },
  { to: '/workers', label: 'Trabajadores', icon: Users },
  { to: '/reports', label: 'Reportes', icon: BarChart3 },
  { to: '/settings', label: 'Ajustes', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <aside className={`flex flex-col bg-white border-r border-neutral-100 h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-[64px] border-b border-neutral-100">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <Store size={18} className="text-white" />
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight text-neutral-900">Metisia</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all
                ${active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                }`}
              title={collapsed ? label : undefined}
            >
              <Icon size={19} className="flex-shrink-0" strokeWidth={active ? 2.2 : 1.8} />
              {!collapsed && label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-100 p-3">
        {!collapsed && user && (
          <div className="px-3 py-2.5 mb-1 bg-neutral-50 rounded-xl">
            <p className="text-xs font-medium text-neutral-700 truncate">{user.businessName}</p>
            <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] text-neutral-400 hover:bg-error/5 hover:text-error transition-colors cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && 'Cerrar sesión'}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full mt-1 py-2 rounded-xl text-neutral-300 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}

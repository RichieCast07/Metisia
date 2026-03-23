import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, Wheat, Receipt,
  Tag, Landmark, CreditCard, Users, BarChart3, Settings,
  LogOut, Menu, X,
} from 'lucide-react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';

const STORAGE_KEY = 'metisia-sidebar-collapsed';

const sections = [
  {
    label: 'PRINCIPAL',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/pos', label: 'Punto de Venta', icon: ShoppingCart },
    ],
  },
  {
    label: 'INVENTARIO',
    items: [
      { to: '/products', label: 'Productos', icon: Package },
      { to: '/ingredients', label: 'Insumos', icon: Wheat },
    ],
  },
  {
    label: 'FINANZAS',
    items: [
      { to: '/sales', label: 'Ventas', icon: Receipt },
      { to: '/promotions', label: 'Promociones', icon: Tag },
      { to: '/cash-register', label: 'Caja', icon: Landmark },
      { to: '/expenses', label: 'Gastos', icon: CreditCard },
    ],
  },
  {
    label: 'GESTIÓN',
    items: [
      { to: '/workers', label: 'Trabajadores', icon: Users },
      { to: '/reports', label: 'Reportes', icon: BarChart3 },
      { to: '/settings', label: 'Ajustes', icon: Settings },
    ],
  },
];

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function Tooltip({ label, children, disabled }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (disabled) return <>{children}</>;

  return (
    <div
      ref={ref}
      className="relative flex w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
            {label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });
  const location = useLocation();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(collapsed)); } catch { /* noop */ }
  }, [collapsed]);

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <aside
      className={`
        flex flex-col h-screen sticky top-0 z-40 flex-shrink-0
        bg-white border-r border-slate-200 shadow-md
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* ── Hamburger toggle ── */}
      <div
        className={`flex items-center h-16 border-b border-slate-100 flex-shrink-0 px-3
          ${collapsed ? 'justify-center' : 'justify-end'}`}
      >
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-all duration-150 cursor-pointer"
          title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed ? <Menu size={19} /> : <X size={19} />}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-none">
        {sections.map((section, si) => (
          <div key={section.label} className={si > 0 ? 'mt-6' : ''}>
            {/* Section label */}
            {!collapsed ? (
              <p className="px-4 mt-6 mb-2 text-xs font-semibold tracking-widest text-slate-400 uppercase select-none first:mt-2">
                {section.label}
              </p>
            ) : (
              si > 0 && <div className="mx-3 my-3 border-t border-slate-100" />
            )}

            <div className="px-2 space-y-0.5">
              {section.items.map(({ to, label, icon: Icon }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <Tooltip key={to} label={label} disabled={!collapsed}>
                    <NavLink
                      to={to}
                      className={`
                        relative flex items-center w-full rounded-lg text-[13.5px] font-medium
                        transition-all duration-150 group
                        ${collapsed ? 'justify-center h-10 px-0' : 'gap-3 px-3 py-2.5'}
                        ${active
                          ? 'bg-sky-50 text-sky-600'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}
                      `}
                    >
                      {/* Active left border indicator */}
                      {active && !collapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-sky-500 rounded-full" />
                      )}
                      <Icon
                        className={`flex-shrink-0 transition-colors w-[18px] h-[18px]
                          ${active ? 'text-sky-500' : 'text-sky-400 group-hover:text-sky-500'}`}
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                      {!collapsed && (
                        <span className="truncate">{label}</span>
                      )}
                    </NavLink>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 border-t border-slate-100 p-3 space-y-1">
        {/* User card */}
        {!collapsed && user ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">{user.name}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
            </div>
          </div>
        ) : collapsed && user ? (
          <Tooltip label={user.name} disabled={false}>
            <div className="flex justify-center w-full pb-1 pt-0.5">
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold cursor-default select-none">
                {initials}
              </div>
            </div>
          </Tooltip>
        ) : null}

        {/* Logout */}
        <Tooltip label="Cerrar sesión" disabled={!collapsed}>
          <button
            onClick={logout}
            className={`flex items-center w-full rounded-lg text-[13px] font-medium
              text-slate-500 hover:text-red-500 hover:bg-red-50
              transition-colors duration-150 cursor-pointer
              ${collapsed ? 'justify-center h-10' : 'gap-3 px-3 py-2.5'}`}
          >
            <LogOut className="w-[17px] h-[17px] flex-shrink-0" strokeWidth={1.8} />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}


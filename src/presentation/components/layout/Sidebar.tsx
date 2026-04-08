import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';

const STORAGE_KEY = 'metisia-sidebar-collapsed';

// ─── ICONOS EXACTOS DEL DASHBOARD ───
const Icon = {
  Dashboard: () => (
    <svg width="16" height="16">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#00d4a0" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#00d4a0" opacity=".5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#00d4a0" opacity=".5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#00d4a0" opacity=".5" />
    </svg>
  ),
  POS: () => (
    <svg width="16" height="16">
      <path d="M2 3h12M3 7h10M5 11h6M2 5h12v9a1 1 0 01-1 1H3a1 1 0 01-1-1V5z"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),

  import React from 'react';
  import { NavLink } from 'react-router-dom';

  // Design tokens (to be moved to theme.ts)
  const COLORS = {
    primary: '#44E3E3',
    sidebarBg: '#fff',
    sidebarText: '#222',
    sidebarActive: '#e6fcfc',
    sidebarBorder: '#e5e7eb',
    userBg: '#f8fafc',
  };

  const navItems = [
    { label: 'Dashboard', icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill={COLORS.primary}/></svg>
    ), to: '/dashboard' },
    { label: 'Ventas', icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H7zm0 2h10c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4H7C4.79 4 3 5.79 3 8v8c0 2.21 1.79 4 4 4z" fill={COLORS.primary}/></svg>
    ), to: '/sales' },
    { label: 'Productos', icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM2 20h20v-2H2v2zm2-4h16v-2H4v2z" fill={COLORS.primary}/></svg>
    ), to: '/products' },
    { label: 'Ingredientes', icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill={COLORS.primary}/></svg>
    ), to: '/ingredients' },
    { label: 'Gastos', icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 4C7.03 4 3 8.03 3 13c0 3.87 3.13 7 7 7s7-3.13 7-7c0-4.97-4.03-9-9-9zm0 16c-2.76 0-5-2.24-5-5 0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.76-2.24 5-5 5z" fill={COLORS.primary}/></svg>
    ), to: '/expenses' },
    { label: 'Promociones', icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M17.63 5.84C16.37 4.58 14.7 4 13 4c-1.7 0-3.37.58-4.63 1.84C6.58 7.1 6 8.77 6 10.47c0 1.7.58 3.37 1.84 4.63C9.1 16.42 10.77 17 12.47 17c1.7 0 3.37-.58 4.63-1.84C17.42 13.9 18 12.23 18 10.53c0-1.7-.58-3.37-1.84-4.63zM12 15c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill={COLORS.primary}/></svg>
    ), to: '/promotions' },
    { label: 'Reportes', icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-6v2h14V7H7z" fill={COLORS.primary}/></svg>
    ), to: '/reports' },
    { label: 'Trabajadores', icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v4H4v-4c0-2.66 5.3-4 8-4zm0-2c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill={COLORS.primary}/></svg>
    ), to: '/workers' },
  ];

  const Sidebar: React.FC = () => {
    return (
      <aside
        className="sidebar"
        style={{
          background: COLORS.sidebarBg,
          borderRight: `1px solid ${COLORS.sidebarBorder}`,
          minWidth: 240,
          maxWidth: 280,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px 0 rgba(68,227,227,0.04)',
        }}
      >
        <div
          className="sidebar-header"
          style={{
            padding: '2rem 1.5rem 1.5rem 1.5rem',
            fontWeight: 700,
            fontSize: 22,
            color: COLORS.primary,
            letterSpacing: 1,
          }}
        >
          Sistema POS
        </div>
        <nav
          className="sidebar-nav"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 0.5rem',
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '0.85rem 1.2rem',
                margin: '0.25rem 0',
                borderRadius: 10,
                color: isActive ? COLORS.primary : COLORS.sidebarText,
                background: isActive ? COLORS.sidebarActive : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: 16,
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              })}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div
          className="sidebar-user"
          style={{
            background: COLORS.userBg,
            borderTop: `1px solid ${COLORS.sidebarBorder}`,
            padding: '1.2rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill={COLORS.primary}/><path d="M16 18c-3.31 0-10 1.66-10 5v3h20v-3c0-3.34-6.69-5-10-5zm0-2c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" fill="#fff"/></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, color: COLORS.sidebarText, fontSize: 15 }}>Usuario</span>
            <span style={{ color: '#888', fontSize: 13 }}>Administrador</span>
          </div>
        </div>
      </aside>
    );
  };

  export default Sidebar;
    label: 'PRINCIPAL',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: Icon.Dashboard },
      { to: '/pos', label: 'Punto de Venta', icon: Icon.POS },
    ],
  },
  {
    label: 'INVENTARIO',
    items: [
      { to: '/products', label: 'Productos', icon: Icon.Products },
      { to: '/ingredients', label: 'Insumos', icon: Icon.Insumos },
    ],
  },
  {
    label: 'FINANZAS',
    items: [
      { to: '/sales', label: 'Ventas', icon: Icon.Ventas },
      { to: '/promotions', label: 'Promociones', icon: Icon.Promociones },
      { to: '/cash-register', label: 'Caja', icon: Icon.Caja },
      { to: '/expenses', label: 'Gastos', icon: Icon.Gastos },
    ],
  },
  {
    label: 'GESTIÓN',
    items: [
      { to: '/workers', label: 'Trabajadores', icon: Icon.Trabajadores },
      { to: '/reports', label: 'Reportes', icon: Icon.Reportes },
      { to: '/settings', label: 'Ajustes', icon: Icon.Ajustes },
    ],
  },
];

// ─── TOOLTIP ───
function Tooltip({ label, children, disabled }: any) {
  const [visible, setVisible] = useState(false);

  if (disabled) return children;

  return (
    <div
      className="relative flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 text-xs bg-[#141720] px-3 py-1 rounded border border-white/10">
          {label}
        </div>
      )}
    </div>
  );
}

// ─── SIDEBAR ───
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });

  const location = useLocation();
  const { logout } = useAuthStore();

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(collapsed)); } catch {}
  }, [collapsed]);

  return (
    <aside className={`flex flex-col h-screen bg-white border-r border-[#e5e7eb] transition-all ${collapsed ? 'w-16' : 'w-56'}`}>

      {/* HEADER */}
      <div className={`flex items-center px-3 py-4 border-b border-[#e5e7eb] ${collapsed ? 'justify-center' : 'justify-between'}`}>
        
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4a0] to-[#00bfff] flex items-center justify-center text-white font-bold text-sm">
              R2
            </div>
            <div>
              <p className="text-sm font-semibold text-[#22223b]">richie22</p>
              <span className="text-xs text-[#00bfff]">● En línea</span>
            </div>
          </div>
        )}

        <button onClick={() => setCollapsed(c => !c)} className="text-[#4a4f6a] hover:text-[#00bfff]">
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto py-3">
        {sections.map(section => (
          <div key={section.label} className="mb-5">

            {!collapsed && (
              <p className="px-4 mb-2 text-[10px] tracking-wider text-[#b0b3c6] uppercase">
                {section.label}
              </p>
            )}

            {section.items.map(item => {
              const active = location.pathname.startsWith(item.to);
              const IconComp = item.icon;

              return (
                <Tooltip key={item.to} label={item.label} disabled={!collapsed}>
                  <NavLink
                    to={item.to}
                    className={`relative flex items-center ${
                      collapsed ? 'justify-center h-10' : 'gap-3 px-4 py-2'
                    } ${
                      active
                        ? 'text-[#00bfff] bg-[#e6f9ff]'
                        : 'text-[#4a4f6a] hover:text-[#00bfff] hover:bg-[#e6f9ff]'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#00bfff]" />
                    )}

                    <span className="w-[16px] h-[16px] flex items-center justify-center">
                      <IconComp color={active ? '#44E3E3' : '#44E3E3'} />
                    </span>

                    {!collapsed && item.label}
                  </NavLink>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-[#e5e7eb] p-3">
        <button
          onClick={logout}
          className={`flex items-center ${
            collapsed ? 'justify-center' : 'gap-2'
          } text-[#b0b3c6] hover:text-[#00bfff]`}
        >
          <LogOut size={16} color="#00bfff" />
          {!collapsed && 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  );
}


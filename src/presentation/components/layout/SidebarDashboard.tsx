import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────


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

const SidebarDashboard: React.FC = () => {
  return (
    <aside
      className="sidebar-dashboard"
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
        className="sidebar-dashboard-header"
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
        className="sidebar-dashboard-nav"
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
              isActive ? 'sidebar-dashboard-link active' : 'sidebar-dashboard-link'
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
        className="sidebar-dashboard-user"
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

export default SidebarDashboard;
      <path d="M1 13c0-2.5 2-4 5-4s5 1.5 5 4" stroke="#44E3E3" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12 7c1.5 0 3 1 3 3" stroke="#44E3E3" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12" cy="4.5" r="1.5" stroke="#44E3E3" strokeWidth="1.3" />
    </svg>
  ),
  Reportes: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="9" width="3" height="5" rx="1" stroke="#44E3E3" strokeWidth="1.3" />
      <rect x="6.5" y="5" width="3" height="9" rx="1" stroke="#44E3E3" strokeWidth="1.3" />
      <rect x="11" y="2" width="3" height="12" rx="1" stroke="#44E3E3" strokeWidth="1.3" />
    </svg>
  ),
  Ajustes: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" stroke="#44E3E3" strokeWidth="1.3" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" stroke="#44E3E3" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  Logout: () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="#44E3E3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { label: "Dashboard", section: "dashboard", icon: <Icons.Dashboard /> },
      { label: "Punto de Venta", section: "pos", icon: <Icons.POS /> },
    ],
  },
  {
    label: "Inventario",
    items: [
      { label: "Productos", section: "productos", icon: <Icons.Productos /> },
      { label: "Insumos", section: "insumos", icon: <Icons.Insumos /> },
    ],
  },
  {
    label: "Finanzas",
    items: [
      { label: "Ventas", section: "ventas", icon: <Icons.Ventas /> },
      { label: "Promociones", section: "promociones", icon: <Icons.Promociones /> },
      { label: "Caja", section: "caja", icon: <Icons.Caja /> },
      { label: "Gastos", section: "gastos", icon: <Icons.Gastos /> },
    ],
  },
  {
    label: "Gestión",
    items: [
      { label: "Trabajadores", section: "trabajadores", icon: <Icons.Trabajadores /> },
      { label: "Reportes", section: "reportes", icon: <Icons.Reportes /> },
      { label: "Ajustes", section: "ajustes", icon: <Icons.Ajustes /> },
    ],
  },
];

export interface SidebarProps {
  active: string;
  onNavigate: (section: string) => void;
}

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <nav
      style={{
        width: 240,
        minWidth: 240,
        background: "#ffffff",
        borderRight: "1px solid #eaecf0",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >


      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid #eaecf0",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "#31B5B5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* Puedes poner tu logo aquí */}
        </div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: "#1a1d23" }}>
            richie22
          </div>
          <div style={{ fontSize: 11, color: "#31B5B5", fontWeight: 500 }}>Sistema POS</div>
        </div>
      </div>

      {/* User */}
      <div
        style={{
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #eaecf0",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#31B5B5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Syne', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          R2
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1d23", lineHeight: 1.2 }}>richie22</div>
          <div style={{ fontSize: 11, color: "#31B5B5", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#31B5B5" }} />
            En línea
          </div>
        </div>
      </div>

      {/* Nav con scroll */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 0", minHeight: 0 }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "#adb5c7",
                padding: "10px 20px 4px",
              }}
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive = active === item.section;
              return (
                <div
                  key={item.section}
                  onClick={() => onNavigate(item.section)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 20px",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#1d9090" : "#6b7280",
                    cursor: "pointer",
                    background: isActive ? "#e8f7f7" : "transparent",
                    borderLeft: isActive ? "3px solid #31B5B5" : "3px solid transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLDivElement).style.background = "#f0fafa";
                      (e.currentTarget as HTMLDivElement).style.color = "#31B5B5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLDivElement).style.background = "transparent";
                      (e.currentTarget as HTMLDivElement).style.color = "#6b7280";
                    }
                  }}
                >
                  <span style={{ width: 16, height: 16, flexShrink: 0, color: isActive ? "#44E3E3" : "#44E3E3", display: "flex" }}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid #eaecf0" }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 500, color: "#adb5c7", cursor: "pointer", padding: "8px 0", transition: "color 0.15s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.color = "#e05a5a")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.color = "#adb5c7")}
        >
          <Icons.Logout />
          Cerrar sesión
        </div>
      </div>
    </nav>
  );
}

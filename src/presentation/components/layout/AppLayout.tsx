import { Outlet } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  // Map pathname to section for SidebarDashboard
  const sectionMap = {
    '/dashboard': 'dashboard',
    '/pos': 'pos',
    '/products': 'productos',
    '/ingredients': 'insumos',
    '/sales': 'ventas',
    '/promotions': 'promociones',
    '/cash-register': 'caja',
    '/expenses': 'gastos',
    '/workers': 'trabajadores',
    '/reports': 'reportes',
    '/settings': 'ajustes',
  };
  const activeSection = sectionMap[location.pathname] || '';

  const handleNavigate = (section) => {
    // Map section to route
    const routeMap = {
      dashboard: '/dashboard',
      pos: '/pos',
      productos: '/products',
      insumos: '/ingredients',
      ventas: '/sales',
      promociones: '/promotions',
      caja: '/cash-register',
      gastos: '/expenses',
      trabajadores: '/workers',
      reportes: '/reports',
      ajustes: '/settings',
    };
    const path = routeMap[section];
    if (path) navigate(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6f8' }}>
      <SidebarDashboard active={activeSection} onNavigate={handleNavigate} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}

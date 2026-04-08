import { Outlet } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      <SidebarDashboard />
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarDashboard />
      <main className="flex-1 flex flex-col overflow-x-hidden min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

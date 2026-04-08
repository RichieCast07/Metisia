import { useState } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import Header from '@/presentation/components/layout/Header';
import Card from '@/presentation/components/ui/Card';
import Button from '@/presentation/components/ui/Button';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog';
import { User } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <Header title="Ajustes" subtitle="Configuración general" />
      <div className="p-8 space-y-8 max-w-2xl">
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-primary-light rounded-xl ring-1 ring-primary/20">
              <User size={18} className="text-primary" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Información de la Cuenta</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2.5 border-b border-slate-100">
              <span className="text-slate-500">Nombre</span>
              <span className="font-medium text-slate-900">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2.5 border-b border-slate-100">
              <span className="text-slate-500">Correo</span>
              <span className="font-medium text-slate-900">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2.5 border-b border-slate-100">
              <span className="text-slate-500">Negocio</span>
              <span className="font-medium text-slate-900">{user?.business_name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Plan</span>
              <span className="font-medium text-slate-900 capitalize">{user?.plan}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-bold text-slate-900 mb-5">Sesión</h2>
          <Button variant="danger" onClick={() => setShowLogout(true)}>
            Cerrar sesión
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={logout}
        title="Cerrar sesión"
        message="Se cerrará tu sesión y tendrás que volver a iniciar sesión para acceder."
        confirmText="Cerrar sesión"
      />
    </>
  );
}

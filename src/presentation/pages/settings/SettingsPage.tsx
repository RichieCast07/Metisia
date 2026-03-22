import { useState } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import Header from '@/presentation/components/layout/Header';
import Card from '@/presentation/components/ui/Card';
import Button from '@/presentation/components/ui/Button';
import Alert from '@/presentation/components/ui/Alert';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog';
import { storage } from '@/infrastructure/storage/StorageAdapter';
import { Download, Upload, Trash2, User } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [success, setSuccess] = useState<string | null>(null);
  const [showClear, setShowClear] = useState(false);

  const handleExport = () => {
    const data = storage.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metisia_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccess('Datos exportados correctamente');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          storage.importAll(reader.result as string);
          setSuccess('Datos importados correctamente. Recarga la página.');
          setTimeout(() => setSuccess(null), 5000);
        } catch {
          setSuccess('Error al importar datos');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClear = () => {
    storage.clearAll();
    logout();
  };

  return (
    <>
      <Header title="Ajustes" subtitle="Configuración general" />
      <div className="p-8 space-y-8 max-w-2xl">
        {success && <Alert type="success" message={success} />}

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User size={18} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-neutral-900">Información de la Cuenta</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500">Nombre</span>
              <span className="font-medium text-neutral-900">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500">Correo</span>
              <span className="font-medium text-neutral-900">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500">Negocio</span>
              <span className="font-medium text-neutral-900">{user?.businessName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-neutral-500">Plan</span>
              <span className="font-medium text-neutral-900 capitalize">{user?.plan}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Gestión de Datos</h2>
          <div className="space-y-3">
            <Button variant="outline" onClick={handleExport} className="w-full justify-start">
              <Download size={16} /> Exportar datos (JSON)
            </Button>
            <Button variant="outline" onClick={handleImport} className="w-full justify-start">
              <Upload size={16} /> Importar datos
            </Button>
            <Button variant="danger" onClick={() => setShowClear(true)} className="w-full justify-start">
              <Trash2 size={16} /> Eliminar todos los datos
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={showClear}
        onClose={() => setShowClear(false)}
        onConfirm={handleClear}
        title="Eliminar todos los datos"
        message="Esta acción eliminará permanentemente todos tus datos y cerrará tu sesión. No se puede deshacer."
        confirmText="Eliminar todo"
      />
    </>
  );
}

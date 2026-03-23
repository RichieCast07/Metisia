import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'primary';
}

export default function ConfirmDialog({
  isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        <div className={`p-3 rounded-xl flex-shrink-0 h-fit ring-1 ${variant === 'danger' ? 'bg-red-50 ring-red-100' : 'bg-blue-50 ring-blue-100'}`}>
          <AlertTriangle size={20} className={variant === 'danger' ? 'text-red-500' : 'text-blue-500'} />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed pt-1.5">{message}</p>
      </div>
      <div className="flex justify-end gap-3 mt-7">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </div>
    </Modal>
  );
}

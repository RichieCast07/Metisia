import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

const config: Record<string, { icon: typeof Info; bg: string; text: string; border: string }> = {
  info: { icon: Info, bg: 'bg-secondary/5', text: 'text-secondary', border: 'border-secondary/20' },
  success: { icon: CheckCircle, bg: 'bg-success/5', text: 'text-success', border: 'border-success/20' },
  warning: { icon: AlertTriangle, bg: 'bg-warning/5', text: 'text-warning', border: 'border-warning/20' },
  error: { icon: AlertCircle, bg: 'bg-error/5', text: 'text-error', border: 'border-error/20' },
};

export default function Alert({ type = 'info', message, onClose }: AlertProps) {
  const { icon: Icon, bg, text, border } = config[type];
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bg} ${border}`}>
      <Icon size={18} className={text} />
      <p className={`text-sm flex-1 ${text}`}>{message}</p>
      {onClose && (
        <button onClick={onClose} className={`${text} hover:opacity-70 cursor-pointer`}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}

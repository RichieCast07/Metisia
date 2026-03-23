import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

const config: Record<string, { icon: typeof Info; bg: string; text: string; border: string; iconBg: string; textBody: string }> = {
  info: { icon: Info, bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', iconBg: 'bg-blue-100', textBody: 'text-blue-700' },
  success: { icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', iconBg: 'bg-emerald-100', textBody: 'text-emerald-700' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', iconBg: 'bg-amber-100', textBody: 'text-amber-700' },
  error: { icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', iconBg: 'bg-red-100', textBody: 'text-red-700' },
};

export default function Alert({ type = 'info', message, onClose }: AlertProps) {
  const { icon: Icon, bg, text, border, iconBg, textBody } = config[type];
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 ${bg} ${border} animate-[slideDown_0.2s_ease-out]`}>
      <div className={`p-1.5 rounded-lg ${iconBg} flex-shrink-0`}>
        <Icon size={16} className={text} />
      </div>
      <p className={`text-sm flex-1 font-semibold ${textBody}`}>{message}</p>
      {onClose && (
        <button onClick={onClose} className={`${text} hover:opacity-70 cursor-pointer p-1.5 rounded-lg hover:bg-black/10 transition-colors`}>
          <X size={15} />
        </button>
      )}
    </div>
  );
}

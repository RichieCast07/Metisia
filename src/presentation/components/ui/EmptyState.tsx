import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-4 bg-primary/5 rounded-2xl mb-5">
        <Inbox size={36} className="text-primary/40" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-neutral-700">{title}</h3>
      {description && <p className="text-sm text-neutral-400 mt-1.5 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

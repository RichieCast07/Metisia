import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  icon?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, icon, className = '', id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </span>
          )}
          <select
            ref={ref}
            id={selectId}
            className={`h-10 w-full rounded-lg border text-sm outline-none transition-all bg-white appearance-none
              ${icon ? 'pl-10 pr-9' : 'pl-3 pr-9'}
              ${error ? 'border-error focus:ring-2 focus:ring-error/20' : 'border-neutral-200 hover:border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/15'}
              ${className}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;

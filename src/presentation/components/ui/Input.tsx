import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, success, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`h-10 w-full rounded-lg border text-sm outline-none transition-all bg-white
              ${icon ? 'pl-10 pr-3' : 'px-3'}
              ${error
                ? 'border-error focus:ring-2 focus:ring-error/20'
                : success
                  ? 'border-success focus:ring-2 focus:ring-success/20'
                  : 'border-neutral-200 hover:border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/15'}
              ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

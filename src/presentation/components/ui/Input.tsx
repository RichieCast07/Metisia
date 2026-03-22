import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
  success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, suffix, success, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-neutral-700">
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
            className={`h-11 w-full rounded-xl border text-sm outline-none transition-all bg-white placeholder:text-neutral-300
              ${icon && suffix ? 'pl-10 pr-10' : icon ? 'pl-10 pr-3' : suffix ? 'pl-3 pr-10' : 'px-3'}
              ${error
                ? 'border-error focus:ring-2 focus:ring-error/20'
                : success
                  ? 'border-success focus:ring-2 focus:ring-success/20'
                  : 'border-neutral-300 hover:border-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/20'}
              ${className}`}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
